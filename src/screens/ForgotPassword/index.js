import React, {Component} from 'react';
import {View, KeyboardAvoidingView, Text, TextInput, Alert, Keyboard} from 'react-native';
import styles from './styles';
import {ScreenHeader, GradientButton, ScreenLoader} from '../../components';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {Colors, iconsColors} from "../../assets/RootStyles";
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import ValidationService from "../../services/ValidationService";
import {
    CHECK_PHONE_NUMBER,
    SEND_VERIFICATION_SMS
} from "../../actionsTypes";

class ForgotPassword extends Component {

    state = {
        number: '',
        loaderVisible: false,
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

    reset = ()=>{
        const {navigation,makeAction} = this.props;
        const {number} = this.state;

        let valid = ValidationService.phoneNumberValidationSignIn(number);

        if(!valid.ok){
            this.setState({
                errorText: valid.error
            });
            return
        }

        this.setState({
            loaderVisible: true
        });

        makeAction(CHECK_PHONE_NUMBER,{
            callback: (data)=>{
                if(!data.exists){
                    Alert.alert('Oops!','We could not find a LineX account \nassociated with this number.');
                    this.setState({
                        loaderVisible: false
                    })
                }else{
                    makeAction(SEND_VERIFICATION_SMS,{
                        callback: ()=>{
                            try {
                                if(DeviceInfo.android){
                                    Keyboard.dismiss();
                                    setTimeout(()=>{
                                        navigation.navigate('ForgotVerification',{number: valid.number});
                                    },100);
                                }else {
                                    navigation.navigate('ForgotVerification',{number: valid.number});
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
                                this.setState({
                                    loaderVisible: false,
                                    errorText: e.response.data.errorMessage
                                })
                            }else {
                                this.setState({
                                    loaderVisible: false
                                })
                            }
                        },
                        number: valid.number
                    })
                }
            },
            error: ()=>{
                this.setState({
                    loaderVisible: false
                })
            },
            number: valid.number
        });
    };

    render() {
        const {navigation} = this.props;
        const {loaderVisible,number,errorText} = this.state;

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                <View style={styles.screen}>
                    <ScreenHeader
                        title={'Forgot Password?'}
                        leftIcon={'Back'}
                        leftIconPress={()=>{navigation.goBack()}}
                    />
                    {loaderVisible?<ScreenLoader/>:null}
                    <Text style={styles.grayText}>Enter your personal phone number and we’ll send you a verification code.</Text>
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
                    </View>
                    {errorText?<Text style={styles.errorText}>{errorText}</Text>:null}
                </View>
                <View style={styles.footer}>
                    {loaderVisible?<View style={styles.loaderFooter}/>:null}
                    <GradientButton
                        title={'Reset password'.toUpperCase()}
                        disabled={!number}
                        onPress={this.reset}
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

export default connect(mapStateToProps,{makeAction})(ForgotPassword)
