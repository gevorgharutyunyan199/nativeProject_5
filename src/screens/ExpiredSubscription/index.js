import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert, StatusBar, BackHandler, ScrollView} from 'react-native';
import styles from './styles';
import LinearGradient from "react-native-linear-gradient";
import {Colors} from '../../assets/RootStyles';
import {sizes} from '../../assets/sizes';
import {connect} from 'react-redux';
import {makeAction} from '../../makeAction';
import {Check} from '../../assets/icons';
import {GradientButton, ScreenHeader, ScreenLoader} from '../../components';
import Iaphub from "react-native-iaphub";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from "../../services/NavigationService";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {
    SET_PRODUCTS,
    SIGN_OUT,
    DELETE_ACCOUNT
} from "../../actionsTypes";

class ExpiredSubscription extends Component {

    state = {
        loaderVisible: true,
        screenLoader: false
    };

    async componentDidMount() {
        if(DeviceInfo.android){
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        }
        NavigationService.init(this.props.navigation,this.props.route);
        let currentUser = await this.getCurrentUser();

        this.navigationListenerFocus = this.props.navigation.addListener('focus', () => {
            StatusBar.setBarStyle('light-content');
            if(DeviceInfo.android){
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
            }
        });
        this.navigationListenerBlur = this.props.navigation.addListener('blur', () => {
            StatusBar.setBarStyle('dark-content');
            if(DeviceInfo.android){
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
            }
        });

        await Iaphub.setUserId(currentUser.id);
        let products = await Iaphub.getProductsForSale();
        this.props.makeAction(SET_PRODUCTS,products);
        this.setState({
            loaderVisible: false
        })
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
        BackHandler.exitApp();
        return true;
    };

    getCurrentUser = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('currentUser');
            return jsonValue != null ? JSON.parse(jsonValue) : {};
        } catch(e) {
            console.log(e)
        }
    };

    subscribe = async (productIndex)=>{
        this.setState({
            loaderVisible: true
        });
        try {
            let transaction = await Iaphub.buy(this.props.signUpData.products[productIndex].sku);
            this.setState({
                loaderVisible: false
            });
            if(transaction.webhookStatus === "failed"){
                Alert.alert(
                    "Purchase delayed",
                    "Your purchase was successful but we need some more time to validate it, should arrive soon!"
                );
            }else{
                this.props.navigation.goBack();
            }
        }catch (e){
            console.log(e,'Iaphub.buy');
            this.setState({
                loaderVisible: false
            });
            if(e.code === "user_cancelled"){
                return
            }

            if(e.code === "product_already_owned"){
                Alert.alert(
                    "Product already owned",
                    "Please restore your purchases in order to fix that issue",
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Restore', onPress: () => Iaphub.restore()}
                    ]
                );
            }else if(e.code === "deferred_payment") {
                Alert.alert(
                    "Purchase awaiting approval",
                    "Your purchase is awaiting approval from the parental control"
                );
            }else if(e.code === "receipt_validation_failed") {
                Alert.alert(
                    "We're having trouble validating your transaction",
                    "Give us some time, we'll retry to validate your transaction ASAP!"
                );
            }else if(e.code === "receipt_invalid") {
                Alert.alert(
                    "Purchase error",
                    "We were not able to process your purchase, if you've been charged please contact the support (support@linex.com)"
                );
            }else if(e.code === "receipt_request_failed") {
                Alert.alert(
                    "We're having trouble validating your transaction",
                    "Please try to restore your purchases later (Button in the settings) or contact the support (support@linex.com)"
                );
            }else{
                Alert.alert(
                    "In-App Purchase Failed",
                    "Looks like the transaction failed. Please try again.",
                    [
                        { text: "OK", onPress: ()=>{}}
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    restore = async ()=>{
        await Iaphub.restore().catch(e=>console.log(e));
    };

    calculateDuration = (durationStr)=>{
        if(durationStr){
            let duration = '';
            duration = durationStr.split('')[2];
            duration = duration === 'D'?'day':duration === 'M'?'month':duration === 'Y'?'year':duration === 'W'?'week':'';

            if(duration === 'day' && (+durationStr.split('')[1]) === 7){
                duration = `1 week`
            }else if(durationStr.split('')[1]>1){
                duration = duration+'s'
            }

            if(duration !== `1 week`){
                duration = `${duration}`
            }
            return duration
        }
        return ''
    };

    signOut = ()=>{
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out \nof the app?",
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Sign Out', onPress: () => this.props.makeAction(SIGN_OUT)}
            ]
        );
    };

    openDeleteModal = ()=>{
        Alert.alert(
            "Are you sure you want to delete your account?",
            "Please note that all your account data will be deleted permanently and your \nLineX number will get unassigned from your account.",
            [
                {text: 'Not Now', onPress: () => {}},
                {text: 'Delete', style: 'destructive',onPress: async () => {
                    this.setState({
                        screenLoader: true
                    });
                    this.props.makeAction(DELETE_ACCOUNT,{
                        callback: ()=>{
                            try {
                                this.setState({
                                    screenLoader: false
                                });
                            }catch (e) {
                                console.log(e)
                            }
                        },
                        error: ()=>{
                            this.setState({
                                screenLoader: false
                            });
                        },
                    })
                }}
            ]
        );
    };

    render() {
        const {navigation,signUpData} = this.props;
        const {loaderVisible,screenLoader} = this.state;
        let productIndex = 0;
        let subscriptionDuration = signUpData.products[productIndex]?this.calculateDuration(signUpData.products[productIndex].subscriptionDuration):'';

        return (
            <LinearGradient style={styles.screen} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={[Colors.appColor1, Colors.appColor2]}>
                <View style={styles.screen}>
                    {screenLoader?<ScreenLoader/>:null}
                    <ScreenHeader
                        fontSize={sizes.size26}
                        color={Colors.white}
                        title={'Your subscription has \nexpired. Please subscribe again\nto continue using the app.'}
                    />
                    <View style={styles.contentContainer}>
                        <View style={styles.emptyPhoneNumberContainer}/>
                        <View style={styles.informRow}>
                            <Check width={sizes.size21} height={sizes.size21}/>
                            <Text style={styles.informText}>High quality calls</Text>
                        </View>
                        <View style={styles.informRow}>
                            <Check width={sizes.size21} height={sizes.size21}/>
                            <Text style={styles.informText}>Unlimited SMS and MMS</Text>
                        </View>
                        <View style={styles.informRow}>
                            <Check width={sizes.size21} height={sizes.size21}/>
                            <Text style={styles.informText}>Business & personal directory </Text>
                        </View>
                        <View style={styles.informRow}>
                            <Check width={sizes.size21} height={sizes.size21}/>
                            <Text style={styles.informText}>Custom voicemail greetings and more</Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <ScrollView>
                            {signUpData.products[productIndex]?<View>
                                <Text style={styles.boldText}>Auto-renewable. Cancel anytime.</Text>
                            </View>:<View style={{height: sizes.size102}}/>}
                            <View style={styles.buttonContainer}>
                                <GradientButton
                                    style={[{width: sizes.size295}]}
                                    loadingIndicator={loaderVisible}
                                    title={signUpData.products[productIndex]?`SUBSCRIBE FOR US$${signUpData.products[productIndex]?signUpData.products[productIndex].priceAmount:''}/${subscriptionDuration.toUpperCase()}`:''}
                                    onPress={()=>{this.subscribe(productIndex)}}
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <GradientButton
                                    indicatorColor={Colors.black}
                                    style={[{width: sizes.size295, backgroundColor: Colors.white, margin: sizes.size2}]}
                                    labelStyle={{color: Colors.black}}
                                    loadingIndicator={loaderVisible}
                                    dontShowLoadingIndicator={true}
                                    title={'SIGN OUT'}
                                    onPress={this.signOut}
                                />
                            </View>
                            <View style={styles.deleteButtonContainer}>
                                <TouchableOpacity disabled={loaderVisible} onPress={this.openDeleteModal}>
                                    <Text style={styles.deleteButton}>Delete Account</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.descText}>
                                Your account will be charged for renewal within 24 hours prior to the end of the current subscription or trial period.
                                Auto-renew may be turned off by going to your iTunes Account Settings and must be turned off at least 24 hours before
                                the end of the current subscription period to take effect. Any unused portion of a free trial period, if offered, will
                                be forfeited when the user purchases a subscription to that publication, where applicable.
                            </Text>
                            <View style={styles.privacyPolicyContainer}>
                                <TouchableOpacity onPress={()=>{navigation.navigate('PrivacyPolicy',{type: 'privacy'})}} style={styles.linkButton}>
                                    <Text style={styles.privacyPolicyLink}>Privacy Policy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{navigation.navigate('PrivacyPolicy',{type: 'terms'})}} style={styles.linkButton}>
                                    <Text style={styles.privacyPolicyLink}>Terms of Service</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </LinearGradient>
        );
    }
}

const mapStateToProps = store =>{
    return {
        signUpData: store.SignUpReducer
    }
};

export default connect(mapStateToProps,{makeAction})(ExpiredSubscription)
