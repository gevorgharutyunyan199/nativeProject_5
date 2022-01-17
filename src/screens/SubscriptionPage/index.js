import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert, StatusBar, BackHandler, ScrollView} from 'react-native';
import styles from './styles';
import LinearGradient from "react-native-linear-gradient";
import {Colors} from '../../assets/RootStyles';
import {sizes} from '../../assets/sizes';
import {connect} from 'react-redux';
import {makeAction} from '../../makeAction';
import {Check} from '../../assets/icons';
import {GradientButton, ScreenHeader} from '../../components';
import Iaphub from "react-native-iaphub";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from "../../services/NavigationService";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {
    SET_PENDING_TYPE,
    SET_PRODUCTS
} from "../../actionsTypes";

class SubscriptionPage extends Component {

    state = {
        loaderVisible: true,
        selectedPhoneNumber: ''
    };

    async componentDidMount() {
        if (DeviceInfo.android) {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        }
        NavigationService.init(this.props.navigation, this.props.route);
        let currentUser = await this.getCurrentUser();
        let selectedPhoneNumber = await AsyncStorage.getItem('selectedPhoneNumber');
        this.setState({selectedPhoneNumber: selectedPhoneNumber});

        this.navigationListenerFocus = this.props.navigation.addListener('focus', () => {
            StatusBar.setBarStyle('light-content');
            if (DeviceInfo.android) {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
            }
        });
        this.navigationListenerBlur = this.props.navigation.addListener('blur', () => {
            StatusBar.setBarStyle('dark-content');
            if (DeviceInfo.android) {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
            }
        });

        await Iaphub.setUserId(currentUser.id);

        await this.getProducts();

        this.setState({
            loaderVisible: false
        })
    }

    getProducts = async () => {
        const products = await Iaphub.getProductsForSale();
        if (products[0]) {
            this.props.makeAction(SET_PRODUCTS, products);
        }else{
            Alert.alert(
                "An Unexpected Error Occured",
                "We're unable to load products. Please try again.",
                [
                    {text: 'Try Again', onPress: () => {this.getProducts()}}
                ]
            );
        }
    }

    componentWillUnmount() {
        if (this.navigationListenerFocus && this.navigationListenerFocus.remove) {
            this.navigationListenerFocus.remove()
        }
        if (this.navigationListenerBlur && this.navigationListenerBlur.remove) {
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
        } catch (e) {
            console.log(e)
        }
    };

    numberMask = (item) => {
        if (item) {
            item = `${item}`;
            return `(${item.substring(0, 3)}) ${item.substring(3, 6)}-${item.substring(6, item.length)}`
        } else {
            return ''
        }
    };

    subscribe = async (productIndex) => {
        this.setState({
            loaderVisible: true
        });
        try {
            let transaction = await Iaphub.buy(this.props.signUpData.products[productIndex].sku);
            this.setState({
                loaderVisible: false
            });
            if (transaction.webhookStatus === "failed") {
                Alert.alert(
                    "Purchase delayed",
                    "Your purchase was successful but we need some more time to validate it, should arrive soon!"
                );
            } else {
                this.props.makeAction(SET_PENDING_TYPE, 0);
                this.props.navigation.navigate('SettingUpPhoneNumber');
            }
        } catch (e) {
            console.log(e, 'Iaphub.buy');
            this.setState({
                loaderVisible: false
            });
            if (e.code === "user_cancelled") {
                return
            }

            if (e.code === "product_already_owned") {
                Alert.alert(
                    "Product already owned",
                    "Please restore your purchases in order to fix that issue",
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Restore', onPress: () => Iaphub.restore()}
                    ]
                );
            } else if (e.code === "deferred_payment") {
                Alert.alert(
                    "Purchase awaiting approval",
                    "Your purchase is awaiting approval from the parental control"
                );
            } else if (e.code === "receipt_validation_failed") {
                Alert.alert(
                    "We're having trouble validating your transaction",
                    "Give us some time, we'll retry to validate your transaction ASAP!"
                );
            } else if (e.code === "receipt_invalid") {
                Alert.alert(
                    "Purchase error",
                    "We were not able to process your purchase, if you've been charged please contact the support (support@linex.com)"
                );
            } else if (e.code === "receipt_request_failed") {
                Alert.alert(
                    "We're having trouble validating your transaction",
                    "Please try to restore your purchases later (Button in the settings) or contact the support (support@linex.com)"
                );
            } else {
                Alert.alert(
                    "In-App Purchase Failed",
                    "Looks like the transaction failed. Please try again.",
                    [
                        {
                            text: "OK", onPress: () => {
                            }
                        }
                    ],
                    {cancelable: false}
                );
            }
        }
    };

    restore = async ()=>{
        this.setState({
            loaderVisible: true
        });

        await Iaphub.restore().then(()=>{
            Alert.alert('Your purchase is restored \nsuccessfully.','');
            this.setState({
                loaderVisible: false
            });
        }).catch((e)=>{
            Alert.alert('No purchase receipt found \non this device.','');
            this.setState({
                loaderVisible: false
            });
            console.log(e)
        });
    };

    calculateDuration = (durationStr) => {
        if (durationStr) {
            let duration = '';
            let count =  durationStr.split('')[1];
            let type =  durationStr.split('')[2];
            switch (type) {
                case 'D':
                    duration = `${count} days`;
                    break;
                case 'W' :
                    duration = `${count * 7} days`;
                    break;
                case 'M' :
                    duration = count > 1 ? `${count} months` : 'a month';
                    break;
                case 'Y' :
                    duration = count > 1 ? `${count} years` : 'a year';
                    break;
                default :
                    break;

            }

            return duration
        }
        return ''
    };

    render() {
        const {navigation, signUpData} = this.props;
        const {loaderVisible, selectedPhoneNumber} = this.state;
        let productIndex = 0;
        let subscriptionDuration = signUpData.products[productIndex] ? this.calculateDuration(signUpData.products[productIndex].subscriptionDuration) : '';
        let subscriptionTrialDuration = signUpData.products[productIndex] ? this.calculateDuration(signUpData.products[productIndex].subscriptionTrialDuration) : '';

        return (
            <LinearGradient style={styles.screen} start={{x: 0, y: 1}} end={{x: 1, y: 0}}
                            colors={[Colors.appColor1, Colors.appColor2]}>
                <View style={styles.screen}>
                    <ScreenHeader
                        fontSize={sizes.size26}
                        color={Colors.white}
                        title={'Start using your new \nphone number'}
                    />
                    <View style={styles.contentContainer}>
                        {selectedPhoneNumber ? <View style={styles.phoneNumberContainer}>
                            <Text style={styles.phoneNumber}>{this.numberMask(selectedPhoneNumber)}</Text>
                        </View> : <View style={styles.emptyPhoneNumberContainer}/>}
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
                            {signUpData.products[productIndex] ? <View>
                                <Text style={styles.boldText}>Auto-renewable. Cancel anytime.</Text>
                                {signUpData.products[productIndex] ? <Text style={styles.freeTrialText}>
                                    {`You have ${subscriptionTrialDuration} free trial. \nThen $${signUpData.products[productIndex] ? signUpData.products[productIndex].priceAmount : ''}/${subscriptionDuration}`}
                                </Text> : null}
                            </View> : <View style={{height: sizes.size102}}/>}
                            <View style={styles.buttonContainer}>
                                <GradientButton
                                    style={[{width: sizes.size295}]}
                                    loadingIndicator={loaderVisible}
                                    title={signUpData.products[productIndex] ? 'START YOUR 7-DAYS FREE TRIAL' : ''}
                                    onPress={() => {
                                        this.subscribe(productIndex)
                                    }}
                                />
                                <TouchableOpacity  onPress={this.restore} style={{marginTop: 13, borderBottomColor: Colors.grayText, borderBottomWidth: 1}}>
                                    <Text style={{color: Colors.grayText}}>Restore Purchases</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.descText}>
                                Your account will be charged for renewal within 24 hours prior to the end of the current
                                subscription or trial period.
                                Auto-renew may be turned off by going to your iTunes Account Settings and must be turned
                                off at least 24 hours before
                                the end of the current subscription period to take effect. Any unused portion of a free
                                trial period, if offered, will
                                be forfeited when the user purchases a subscription to that publication, where
                                applicable.
                            </Text>
                            <View style={styles.privacyPolicyContainer}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('PrivacyPolicy', {type: 'privacy'})
                                }} style={styles.linkButton}>
                                    <Text style={styles.privacyPolicyLink}>Privacy Policy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('PrivacyPolicy', {type: 'terms'})
                                }} style={styles.linkButton}>
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

const mapStateToProps = store => {
    return {
        signUpData: store.SignUpReducer
    }
};

export default connect(mapStateToProps, {makeAction})(SubscriptionPage)
