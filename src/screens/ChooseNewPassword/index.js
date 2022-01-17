import React, {Component} from 'react';
import {View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import styles from './styles';
import {GradientButton, ScreenHeader, ScreenLoader} from '../../components';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {Colors, iconsColors} from "../../assets/RootStyles";
import {RESET_PASSWORD} from "../../actionsTypes";

class ChooseNewPassword extends Component {

    state = {
        loaderVisible: false,
        password: '',
        confirmPassword: '',
        secureTextEntryPassword: true,
        secureTextEntryConfirmPassword: true,
        errorText: ''
    };

    componentDidMount() {
        this.passwordInput.focus()
    }

    _handleChange = (key, value)=>{
        this.setState({
            [key]: value,
            errorText: ''
        })
    };

    validate = ()=>{
        const {confirmPassword,password} = this.state;
        let passwordValidation = 0;

        if(password.length<8){
            this.setState({
                errorText: 'Password must be at least 8 characters'
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

        if(password !== confirmPassword){
            this.setState({
                errorText: 'Passwords do not match.'
            });
            return false
        }
        return true
    };

    submit = ()=>{
        const {navigation,makeAction,route} = this.props;
        const {password} = this.state;
        if(this.validate()){
            this.setState({
                loaderVisible: true
            });
            makeAction(RESET_PASSWORD,{
                callback: ()=>{
                    try {
                        Alert.alert(
                            "Success",
                            "Your password is successfully changed."
                        );
                        navigation.navigate('SignInPage');
                        this.setState({
                            loaderVisible: false
                        });
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
                number: route.params.number,
                code: route.params.code,
                password: password
            })
        }
    };

    render() {
        const {navigation} = this.props;
        const {
            loaderVisible,
            password,
            confirmPassword,
            secureTextEntryPassword,
            secureTextEntryConfirmPassword,
            errorText} = this.state;

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                <View style={styles.screen}>
                    <ScreenHeader
                        title={'Choose New Password'}
                        leftIcon={'Back'}
                        leftIconPress={()=>{navigation.goBack()}}
                    />
                    {loaderVisible?<ScreenLoader/>:null}
                    <Text style={styles.grayText}>Choose a new password for your account to continue.</Text>
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={(input)=>{this.passwordInput = input}}
                                style={styles.numberInput}
                                value={password}
                                onChangeText={text => this._handleChange('password',text)}
                                placeholderTextColor={iconsColors.gray}
                                placeholder={'New password'}
                                selectionColor={Colors.cancel}
                                secureTextEntry={secureTextEntryPassword}
                            />
                            <TouchableOpacity onPress={()=>{this.setState({secureTextEntryPassword: !secureTextEntryPassword})}}>
                                {password?<Image style={styles.showIcon} source={require('../../assets/images/icons/eye-hover.png')}/>
                                    :<Image style={styles.showIcon} source={require('../../assets/images/icons/eye.png')}/>}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.numberInput}
                                value={confirmPassword}
                                onChangeText={text => this._handleChange('confirmPassword',text)}
                                placeholderTextColor={iconsColors.gray}
                                placeholder={'Re-enter new password'}
                                selectionColor={Colors.cancel}
                                secureTextEntry={secureTextEntryConfirmPassword}
                            />
                            <TouchableOpacity onPress={()=>{this.setState({secureTextEntryConfirmPassword: !secureTextEntryConfirmPassword})}}>
                                {confirmPassword?<Image style={styles.showIcon} source={require('../../assets/images/icons/eye-hover.png')}/>
                                    :<Image style={styles.showIcon} source={require('../../assets/images/icons/eye.png')}/>}
                            </TouchableOpacity>
                        </View>
                    </View>
                    {errorText?<Text style={styles.errorText}>{errorText}</Text>:null}
                </View>
                <View style={styles.footer}>
                    {loaderVisible?<View style={styles.loaderFooter}/>:null}
                    <GradientButton
                        title={'Submit'.toUpperCase()}
                        disabled={!password || !confirmPassword}
                        onPress={this.submit}
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

export default connect(mapStateToProps,{makeAction})(ChooseNewPassword)
