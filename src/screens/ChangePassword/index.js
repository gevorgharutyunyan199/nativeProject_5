import React, {Component} from 'react';
import {View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Text, Alert, Keyboard} from 'react-native';
import styles from './styles';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {TabScreenHeader, GradientButton, ScreenLoader} from "../../components";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {Colors, iconsColors} from "../../assets/RootStyles";
import {CHANGE_PASSWORD} from "../../actionsTypes";
import {sizes} from "../../assets/sizes";

class ChangePassword extends Component {

    state = {
        loaderVisible: false,
        password: '',
        confirmPassword: '',
        currentPassword: '',
        secureTextEntryPassword: true,
        secureTextEntryConfirmPassword: true,
        secureTextEntryCurrentPassword: true,
        errorText: '',
        keyboardShow: false
    };

    componentDidMount() {
        this.keyboardListenerShow = Keyboard.addListener('keyboardDidShow',this._keyboardDidShow);
        this.keyboardListenerHide = Keyboard.addListener('keyboardDidHide',this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardListenerShow?.remove();
        this.keyboardListenerHide?.remove();
    }

    _keyboardDidShow = () => {
        try {
            this.setState({
                keyboardShow: true
            })
        }catch (e) {
            console.log(e)
        }
    };

    _keyboardDidHide = () => {
        try {
            this.setState({
                keyboardShow: false
            })
        }catch (e) {
            console.log(e)
        }
    };

    _handleChange = (key, value)=>{
        this.setState({
            [key]: value,
            errorText: ''
        })
    };

    valid = ()=>{
        const {password, confirmPassword} = this.state;
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
                errorText: 'New passwords do not match.'
            });
            return false
        }

        return true
    };

    save = ()=>{
        const {navigation, makeAction} = this.props;
        const {password, currentPassword} = this.state;
        if(this.valid()){
            this.setState({
                loaderVisible: true
            });
            makeAction(CHANGE_PASSWORD,{
                callback: ()=>{
                    try {
                        Alert.alert(
                            "Done",
                            "Your password successfully changed"
                        );
                        navigation.goBack();
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
                            errorText: e.response.data.errorCode === "UMCP3"?'Current password is incorrect.':e.response.data.errorMessage
                        })
                    }else {
                        this.setState({
                            loaderVisible: false
                        })
                    }
                },
                password: password,
                currentPassword: currentPassword
            })
        }
    };

    render() {
        const {navigation} = this.props;
        const {
            password,
            secureTextEntryPassword,
            confirmPassword,
            secureTextEntryConfirmPassword,
            currentPassword,
            secureTextEntryCurrentPassword,
            loaderVisible,
            errorText,
            keyboardShow
        } = this.state;

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                {loaderVisible?<ScreenLoader/>:null}
                <View style={styles.screen}>
                    <View style={styles.headerContainer}>
                        <TabScreenHeader
                            leftIcon={'back'}
                            leftIconPress={()=>{
                                navigation.goBack()
                            }}
                            title={'Change Password'}
                        />
                    </View>
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.numberInput}
                                value={currentPassword}
                                onChangeText={text => this._handleChange('currentPassword',text)}
                                placeholderTextColor={iconsColors.gray}
                                placeholder={'Current password'}
                                selectionColor={Colors.cancel}
                                secureTextEntry={secureTextEntryCurrentPassword}
                            />
                            <TouchableOpacity onPress={()=>{this.setState({secureTextEntryCurrentPassword: !secureTextEntryCurrentPassword})}}>
                                {currentPassword?<Image style={styles.showIcon} source={require('../../assets/images/icons/eye-hover.png')}/>
                                    :<Image style={styles.showIcon} source={require('../../assets/images/icons/eye.png')}/>}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
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
                                placeholder={'Confirm password'}
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
                <View style={[styles.footer,keyboardShow && DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?{marginBottom: sizes.size10}:null]}>
                    <GradientButton
                        title={'SAVE'.toUpperCase()}
                        disabled={!password || !confirmPassword || !currentPassword}
                        onPress={this.save}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(ChangePassword)
