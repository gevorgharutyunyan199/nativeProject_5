import React, {Component} from 'react';
import {
    View,
    KeyboardAvoidingView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Keyboard,
    ScrollView,
    BackHandler
} from 'react-native';
import styles from './styles';
import {ScreenHeader, GradientButton, ScreenLoader} from '../../components';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {Colors, iconsColors} from "../../assets/RootStyles";
import {sizes} from "../../assets/sizes";
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Iaphub from "react-native-iaphub";
import ChatService from "../../services/ChatService";
import ValidationService from "../../services/ValidationService";
import {
    GET_CURRENT_USER,
    SET_ACTIVE_PRODUCTS,
    SIGN_IN
} from "../../actionsTypes";

class SignInPage extends Component {

    state = {
        number: '',
        password: '',
        loaderVisible: false,
        secureTextEntry: true,
        errorText: ''
    };

    componentDidMount() {
        const {route,navigation} = this.props;

        this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
            if(DeviceInfo.android){
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
            }
        });

        this.navigationListenerBlur = this.props.navigation.addListener('blur', async () => {
            if(DeviceInfo.android){
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
            }
        });

        if(route.params && route.params.phoneNumber){
            this.setState({
                number: route.params.phoneNumber
            })
        }
        navigation.setOptions({
            gestureEnabled: route.params && route.params.disableBackSwipe?false:true
        });
        if(DeviceInfo.ios){
            this.numberInput.focus()
        }
    }

    componentWillUnmount() {
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove()
        }
        if(this.navigationListenerBlur && this.navigationListenerBlur.remove){
            this.navigationListenerBlur.remove()
        }
    }

    handleBackButton = () => {
        const {route,navigation} = this.props;
        if(route.params && route.params.disableBackSwipe){
            BackHandler.exitApp();
        }else {
            navigation.goBack()
        }
        return true;
    };

    _handleChange = (key, value)=>{
        this.setState({
            [key]: value,
            errorText: ''
        })
    };

    clearInputs = ()=>{
        setTimeout(()=>{
            this.setState({
                number: '',
                password: ''
            })
        },1000)
    };

    checkUserStatus = async ()=>{
        const {navigation} = this.props;
        let currentUser = await AsyncStorage.getItem('currentUser');
        if(currentUser){
            currentUser = JSON.parse(currentUser);
            await Iaphub.setUserId(currentUser.id);
            ChatService.setup();
            let activeProducts = await Iaphub.getActiveProducts().catch((e)=>{
                console.log(e,'getActiveProducts')
            });
            if(currentUser.status === 'Active' && (!currentUser.orderedNumbers || currentUser.orderedNumbers?.length === 0)){
                navigation.navigate('SignUpStep1',{
                    bacButtonHide: true
                });
            }else if(currentUser.status === 'Pending'){
                navigation.navigate('SettingUpPhoneNumber',{
                    dontCallOrder: true
                });
            }else if(currentUser.status === 'Expired'){
                navigation.replace('TabNavigation',{clearInputs: this.clearInputs});
            }else if(currentUser.status === 'Active'){
                navigation.replace('TabNavigation',{clearInputs: this.clearInputs});
            }else if(!activeProducts.length && this.state.initialRouteName !== 'SubscriptionPage'){
                navigation.navigate('SubscriptionPage');
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

    signIn = async ()=>{
        const {makeAction} = this.props;
        const {number,password} = this.state;
        let loginNumber = number;
        let valid = ValidationService.phoneNumberValidationSignIn(loginNumber);

        Keyboard.dismiss();

        if(!valid.ok){
            this.setState({
                errorText: valid.error
            });
            return
        }else {
            loginNumber = valid.number
        }

        this.setState({
            loaderVisible: true
        });

        await AsyncStorage.setItem('userNP', JSON.stringify({
            number: loginNumber,
            password: password
        }));

        makeAction(SIGN_IN,{
            callback: ()=>{
                try {
                    makeAction(GET_CURRENT_USER,{
                        callback: async ()=>{
                            try {
                                await this.checkUserStatus();
                            }catch (e){
                                console.log(e)
                            }
                        },
                        error: ()=>{
                            this.setState({
                                loaderVisible: false
                            })
                        }
                    })
                }catch (e){
                    console.log(e)
                }
            },
            error: (e)=>{
                if(e.response){
                    this.setState({
                        loaderVisible: false,
                        errorText: e.response.data.errorCode === "UMSI1"?'Incorrect credentials. Please try again.':e.response.data.errorMessage
                    })
                }else{
                    this.setState({
                        loaderVisible: false
                    })
                }
            }
        })
    };

    render() {
        const {navigation} = this.props;
        const {loaderVisible,number,password,secureTextEntry,errorText} = this.state;

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                <View style={styles.screen}>
                    <ScreenHeader
                        title={'Sign In'}
                        leftIcon={'Back'}
                        leftIconPress={()=>{
                            navigation.navigate('WelcomePage');
                            try {
                                this.setState({
                                    number: '',
                                    password: '',
                                    loaderVisible: false,
                                    secureTextEntry: true,
                                    errorText: ''
                                })
                            }catch (e) {
                                console.log(e)
                            }
                        }}
                    />
                    {loaderVisible?<ScreenLoader/>:null}
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        ref={ref => this.scrollContainer = ref}
                    >
                        <Text style={styles.grayText}>Enter your personal phone number and password below to sign in.</Text>
                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    ref={(input)=>{this.numberInput = input}}
                                    style={styles.numberInput}
                                    keyboardType={'phone-pad'}
                                    value={number}
                                    onChangeText={text => this._handleChange('number',text)}
                                    placeholderTextColor={iconsColors.gray}
                                    placeholder={'Phone number'}
                                    selectionColor={Colors.cancel}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.numberInput}
                                    value={password}
                                    onChangeText={text => this._handleChange('password',text)}
                                    placeholderTextColor={iconsColors.gray}
                                    placeholder={'Password'}
                                    selectionColor={Colors.cancel}
                                    secureTextEntry={secureTextEntry}
                                    onFocus={()=>{
                                        setTimeout(()=>{
                                            this.scrollContainer.scrollToEnd({animated: true});
                                        },100)
                                    }}
                                />
                                <TouchableOpacity onPress={()=>{this.setState({secureTextEntry: !secureTextEntry})}}>
                                    {password?<Image style={styles.showIcon} source={require('../../assets/images/icons/eye-hover.png')}/>
                                        :<Image style={styles.showIcon} source={require('../../assets/images/icons/eye.png')}/>}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {errorText?<Text style={styles.errorText}>{errorText}</Text>:null}
                        <View style={[styles.forgotTextContainer,!errorText?{marginTop: sizes.size25}:null]}>
                            <TouchableOpacity onPress={()=>{navigation.navigate('ForgotPassword')}}>
                                <Text style={[styles.forgotText]}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.footer}>
                    {loaderVisible?<View style={styles.loaderFooter}/>:null}
                    <GradientButton
                        title={'sign in'.toUpperCase()}
                        disabled={!number || !password}
                        onPress={this.signIn}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = store =>{
    return {
        signUpData: store.SignUpReducer
    }
};

export default connect(mapStateToProps,{makeAction})(SignInPage)
