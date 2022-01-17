import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator, Image, Alert, StatusBar, Text, Animated} from 'react-native';
import {Colors, fonts} from "./assets/RootStyles";
import {AppState} from 'react-native';
import Navigation from './Navigation';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Iaphub from "react-native-iaphub";
import {apiUrl, appInfo} from "./assets/constants";
import {makeAction} from "./makeAction";
import NavigationService from './services/NavigationService';
import ChatService from './services/ChatService';
import {DeviceInfo} from "./assets/DeviceInfo";
import {sizes} from "./assets/sizes";
import HttpClient from './services/HttpClient';
import NetInfo from "@react-native-community/netinfo";
import {
    SET_ACTIVE_PRODUCTS,
    GET_CURRENT_USER,
    SET_LAST_CALL_COUNT,
    SIGN_OUT,
    REFRESH_TOKEN,
    SET_FCM_TOKEN
} from "./actionsTypes";
import {checkNotifications} from "react-native-permissions";
import NotificationService from "./services/NotificationService";
import messaging from "@react-native-firebase/messaging";

class Main extends Component{

    state = {
        loaderVisible: true,
        loaderVisibleSession: false,
        initialRouteName: 'WelcomePage',
        initialParams: {},
        position: new Animated.Value(-sizes.size100)
    };

    async componentDidMount() {
        StatusBar.setBarStyle('dark-content');

        await Iaphub.init({...appInfo});

        let userAccessTokens = await AsyncStorage.getItem('userAccessTokens');

        if(userAccessTokens){
            this.props.makeAction(REFRESH_TOKEN, {
                callback: async ()=>{
                    await this.setInterceptor();
                    this.props.makeAction(GET_CURRENT_USER,{
                        callback: async ()=>{
                            await ChatService.setup();
                            AppState.addEventListener("change", this._handleAppStateChange);
                            await this._getActiveProducts();
                        },
                        error: ()=>{
                            AppState.addEventListener("change", this._handleAppStateChange);
                            this.setState({
                                loaderVisible: false
                            })
                        }
                    })

                    await checkNotifications().then(async (res) => {
                        if (res.status === 'granted') {
                            await NotificationService.setup()
                            const authStatus = await messaging().requestPermission();
                            if (authStatus === 1) {
                                let tokenFCM = await AsyncStorage.getItem('tokenFCM');
                                if (!tokenFCM) {
                                    tokenFCM = await messaging().getToken();
                                }
                                if (tokenFCM) {
                                    this.props.makeAction(SET_FCM_TOKEN, {tokenFCM})
                                }
                            }

                        }
                    });
                },
                error: (e)=>{
                    if(e.toString() === 'Error: Network Error' || e.toString() === 'Error: timeout of 100ms exceeded'){
                        Alert.alert(
                            'Network Error',
                            '',
                            [
                                {
                                    text: "Try Again",
                                    onPress: async ()=>{
                                        await this.componentDidMount();
                                    }
                                },
                                {
                                    text: "Sign Out",
                                    onPress: async ()=>{
                                        AsyncStorage.clear();
                                        this.setState({
                                            initialRouteName: 'WelcomePage',
                                            loaderVisible: false,
                                            loaderVisibleSession: false
                                        })
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }else {
                        Alert.alert(
                            'Something went wrong',
                            '',
                            [
                                {
                                    text: "OK",
                                    onPress: ()=>{
                                        AsyncStorage.clear();
                                        this.setState({
                                            initialRouteName: 'WelcomePage',
                                            loaderVisible: false,
                                            loaderVisibleSession: false
                                        })
                                    }
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            });
        }else {
            await this.setInterceptor();
            this.setState({
                loaderVisible: false
            });
            AppState.addEventListener("change", this._handleAppStateChange);
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    setInterceptor = async ()=>{
        await HttpClient.addRequestInterceptor((request)=>{
            NetInfo.fetch().then(state => {
                if(!state.isConnected){
                    if(this.connectionDetectTimeoute){
                        clearTimeout(this.connectionDetectTimeoute)
                    }
                    Animated.timing(
                        this.state.position,
                        {
                            toValue: sizes.size46,
                            duration: 150,
                            useNativeDriver: false
                        }
                    ).start(()=>{
                        this.connectionDetectTimeoute = setTimeout(()=>{
                            Animated.timing(
                                this.state.position,
                                {
                                    toValue: -sizes.size100,
                                    duration: 150,
                                    useNativeDriver: false
                                }
                            ).start()
                        },3000)
                    });
                }
            });

            return request
        });

        await HttpClient.addResponseInterceptor((response) => {
            if(response.request.responseURL.indexOf('user/refresh/token') === -1 && response.status === 200){
                this.props.makeAction(SET_LAST_CALL_COUNT,0);
                if(this.state.loaderVisibleSession){
                    this.setState({
                        loaderVisibleSession: false
                    });
                }
            }
            return response
        }, async (error) => {
            console.log(error.response);
            if(error && error.response && error.response.data.errorCode === "UMSVS1"){
                error.response.data.errorMessage = 'Please provide your US phone number'
            }
            if(this.props.actionsData.lastCallCount === 1 && error.response.config.url !== `${apiUrl}user/refresh/token`){
                return Promise.reject(error);
            }
            if(error && error.response && error.response.status === 401 && this.props.actionsData.lastCallCount < 1){
                if(!NavigationService.navigation){
                    this.setState({
                        loaderVisibleSession: true
                    });
                }
                let count = this.props.actionsData.lastCallCount+1;
                this.props.makeAction(SET_LAST_CALL_COUNT,count);
                this.props.makeAction(REFRESH_TOKEN, {
                    callback: ()=>{
                        console.log('Token refreshed');
                        this.props.makeAction(this.props.actionsData.lastAction.type,this.props.actionsData.lastAction.payload);
                    }
                });
            }else if(error && error.response && error.response.status === 401 && this.props.actionsData.lastCallCount === 1){
                Alert.alert(
                    'Session Expired',
                    'Your session has expired. Please try to sign in again.',
                    [
                        {
                            text: "OK",
                            onPress: ()=>{
                                this.props.makeAction(SIGN_OUT, {
                                    navigation: {
                                        navigate: ()=>{
                                            this.setState({
                                                initialRouteName: 'SignInPage'
                                            })
                                        }
                                    }
                                });
                                this.setState({
                                    loaderVisibleSession: false
                                });
                            }
                        }
                    ],
                    { cancelable: false }
                );
                return Promise.reject(error);
            }else {
                return Promise.reject(error);
            }
        });
    };

    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState === "active") {
            await this._getActiveProducts();
        }
    };

    _getActiveProducts = async ()=>{
        let currentUser = await AsyncStorage.getItem('currentUser');
        if(currentUser){
            currentUser = JSON.parse(currentUser);
            await Iaphub.setUserId(currentUser.id);
            let activeProducts = await Iaphub.getActiveProducts().catch((e)=>{
                console.log(e,'getActiveProducts')
            });
            if(currentUser.status === 'Active' && (!currentUser.orderedNumbers || currentUser.orderedNumbers?.length === 0)){
                this.setState({
                    initialRouteName: 'SignUpStep1',
                    initialParams: {
                        bacButtonHide: true
                    }
                })
            }else if(currentUser.status === 'Pending'){
                this.setState({
                    initialRouteName: 'SettingUpPhoneNumber',
                    initialParams: {
                        dontCallOrder: true
                    }
                })
            }else if(currentUser.status === 'Expired'){
                if(!NavigationService.navigation){
                    this.setState({
                        loaderVisibleSession: true
                    });
                }
                this.setState({
                    initialRouteName: 'TabNavigation',
                    loaderVisibleSession: false
                })
            }else if(currentUser.status === 'Active'){
                this.setState({
                    initialRouteName: 'TabNavigation'
                })
            }else if(!activeProducts.length && this.state.initialRouteName !== 'SubscriptionPage'){
                this.setState({
                    initialRouteName: 'SubscriptionPage'
                })
            }
            this.setState({
                loaderVisible: false
            });
            this.props.makeAction(SET_ACTIVE_PRODUCTS,activeProducts);
        }else{
            if(this.state.loaderVisible){
                this.setState({
                    loaderVisible: false
                })
            }
        }
    };

    render() {
        const {loaderVisible,initialRouteName,initialParams,loaderVisibleSession, position} = this.state;
        return(
            loaderVisible || loaderVisibleSession?<View style={styles.loaderContainer}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('./assets/images/splash/logo.png')}/>
                </View>
                <Image style={styles.pathImage} source={require('./assets/images/splash/path.png')}/>
                <View style={styles.indicatorContainer}>
                    <View style={styles.indicator}>
                        <ActivityIndicator size={'small'} color={Colors.white}/>
                    </View>
                </View>
            </View>:<View style={styles.flex}>
                <Animated.View style={[styles.connectionPopup,{top: position}]}>
                    <Text style={styles.connectionPopupText}>No Internet Connection</Text>
                </Animated.View>
                <Navigation initialRouteName={initialRouteName} initialParams={initialParams}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        backgroundColor: Colors.appColor1,
    },
    flex: {
        flex: 1
    },
    logoContainer: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: sizes.size60,
        height: sizes.size62
    },
    pathImage: {
        position: 'absolute',
        zIndex: 10,
        bottom: -10,
        left: 0,
        right: 0,
        width: DeviceInfo.deviceWidth,
        height: sizes.size260
    },
    indicatorContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    indicator: {
        marginTop: sizes.size100
    },
    connectionPopup: {
        height: sizes.size52,
        position: 'absolute',
        zIndex: 10,
        left: sizes.size5,
        right: sizes.size5,
        backgroundColor: Colors.wrong,
        borderRadius: sizes.size7,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectionPopupText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.white
    }
});

const mapStateToProps = store =>{
    return {
        signUpData: store.SignUpReducer,
        actionsData: store.ActionsReducer,
    }
};

export default connect(mapStateToProps,{makeAction})(Main)
