import React, {Component} from 'react';
import {
    View,
    KeyboardAvoidingView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Keyboard,
    Alert,
    ScrollView
} from 'react-native';
import styles from './styles';
import {GradientButton, ScreenHeader, ScreenLoader} from '../../components';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {Colors, iconsColors} from "../../assets/RootStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import ValidationService from "../../services/ValidationService";
import {
    SEND_VERIFICATION_SMS,
    CHECK_PHONE_NUMBER
} from '../../actionsTypes';

class CreateAccount extends Component {

    state = {
        loaderVisible: false,
        number: '',
        password: '',
        secureTextEntry: true,
        errorText: ''
    };

    componentDidMount() {
       if(DeviceInfo.ios){
           this.numberInput.focus()
       }
    }

    _handleChange = (key, value)=>{
        this.setState({
            [key]: value,
            errorText: ''
        })
    };

    validate = ()=>{
        const {password} = this.state;
        let passwordValidation = 0;

        if(password.length<8){
            this.setState({
                errorText: 'Password must be at least 8 characters.'
            });
            return false
        }

        if(/\d/.test(password)){
            passwordValidation = passwordValidation + 1;
        }

        if(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(password)){
            passwordValidation = passwordValidation + 1;
        }

        if(/[a-z]/.test(password)){
            passwordValidation = passwordValidation + 1;
        }

        if(/[A-Z]/.test(password)){
            passwordValidation = passwordValidation + 1;
        }

        if(passwordValidation<3){
            this.setState({
                errorText: 'Password must contain at least three of the following: \nuppercase letters, lowercase letters, numbers, and symbols.'
            });
            return false
        }
        return true
    };

    register = async ()=>{
        const {navigation,makeAction} = this.props;
        const {number,password} = this.state;
        let numberSend = number;
        let valid = ValidationService.phoneNumberValidationSignIn(numberSend);

        Keyboard.dismiss();

        if(!valid.ok){
            this.setState({
                errorText: valid.error
            });
            return
        }else {
            numberSend = valid.number
        }

        if(this.validate()){
            this.setState({
                loaderVisible: true
            });

            await AsyncStorage.setItem('userNP', JSON.stringify({
                number: numberSend,
                password: password
            }));
            makeAction(CHECK_PHONE_NUMBER,{
                callback: (data)=>{
                    if(!data.exists){
                        makeAction(SEND_VERIFICATION_SMS,{
                            callback: ()=>{
                                try {
                                    if(DeviceInfo.android){
                                        Keyboard.dismiss();
                                        setTimeout(()=>{
                                            navigation.navigate('ForgotVerification',{number: number});
                                        },100);
                                    }else {
                                        navigation.navigate('VerifyNumber');
                                    }
                                    this.setState({
                                        loaderVisible: false
                                    })
                                }catch (e){
                                    console.log(e)
                                }
                            },
                            error: (e)=>{
                                if(e.response){
                                    if(e.response.data.errorCode === "UMSVS1"){
                                        e.response.data.errorMessage = 'Please provide your 10-digit phone number.'
                                    }
                                    this.setState({
                                        loaderVisible: false,
                                        errorText: e.response.data.errorMessage
                                    })
                                }else {
                                    this.setState({
                                        loaderVisible: false
                                    })
                                }
                            }
                        })
                    }else{
                        this.setState({
                            loaderVisible: false
                        });
                        Alert.alert(
                            "Please Sign In",
                            "Looks like you have gone through the setup already. Click sign in to \ncontinue.",
                            [
                                {text: 'Cancel', style: 'cancel'},
                                {text: 'Sign In', onPress: () => navigation.navigate('SignInPage', {phoneNumber: numberSend})}
                            ]
                        );
                    }
                },
                error: (e)=>{
                    if(e.response){
                        this.setState({
                            loaderVisible: false,
                            errorText: e.response.data.errorMessage
                        })
                    }else {
                        this.setState({
                            loaderVisible: false
                        })
                    }
                }
            });
        }
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
                        title={'Create Account'}
                        leftIcon={'Back'}
                        leftIconPress={()=>{navigation.goBack()}}
                    />
                    {loaderVisible?<ScreenLoader/>:null}
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={styles.grayText}>Enter your personal phone number to receive an SMS verification code.</Text>
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
                                    selectionColor={Colors.appColor1}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.numberInput}
                                    value={password}
                                    onChangeText={text => this._handleChange('password',text)}
                                    placeholderTextColor={iconsColors.gray}
                                    placeholder={'Password'}
                                    selectionColor={Colors.appColor1}
                                    secureTextEntry={secureTextEntry}
                                />
                                <TouchableOpacity onPress={()=>{this.setState({secureTextEntry: !secureTextEntry})}}>
                                    {password?<Image style={styles.showIcon} source={require('../../assets/images/icons/eye-hover.png')}/>
                                    :<Image style={styles.showIcon} source={require('../../assets/images/icons/eye.png')}/>}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {errorText?<Text style={styles.errorText}>{errorText}</Text>:null}
                    </ScrollView>
                </View>
                <View style={styles.footer}>
                    {loaderVisible?<View style={styles.loaderFooter}/>:null}
                    <GradientButton
                        title={'Register'.toUpperCase()}
                        disabled={!number || !password}
                        onPress={this.register}
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

export default connect(mapStateToProps,{makeAction})(CreateAccount)
