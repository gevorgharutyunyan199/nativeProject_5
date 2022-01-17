import React, {Component} from 'react';
import {View, Text, KeyboardAvoidingView, TextInput, Keyboard} from 'react-native';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {GradientButton, ScreenLoader, TabScreenHeader} from "../../components";
import styles from "./styles";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {iconsColors} from "../../assets/RootStyles";
import {sizes} from "../../assets/sizes";
import {SEND_VERIFICATION_SMS} from "../../actionsTypes";
import ValidationService from "../../services/ValidationService";

class ChangeRegisteredNumber extends Component{
    state = {
        loaderVisible: false,
        number: '',
        keyboardShow: false,
        errorText: ''
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

    changeNumber = (text)=>{
      this.setState({
          number: text,
          errorText: ''
      })
    };

    receiveCode = ()=>{
        const {number} = this.state;
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

        this.setState({
            loaderVisible: true
        });

        this.props.makeAction(SEND_VERIFICATION_SMS,{
            callback: ()=>{
                try {
                    this.setState({
                        loaderVisible: false
                    });
                    this.props.navigation.navigate('VerifyNumber', {type: 'changeNumber', number: numberSend});
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
            },
            number: numberSend
        })
    };

    render() {
        const {navigation} = this.props;
        const {loaderVisible,number,keyboardShow,errorText} = this.state;

        return(
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                {loaderVisible?<ScreenLoader tabScreen={true}/>:null}
                <View style={styles.screen}>
                    <View style={styles.headerContainer}>
                        <TabScreenHeader
                            title={'Change Registered Number'}
                            leftIcon={'back'}
                            leftIconPress={()=>{
                                navigation.goBack()
                            }}
                            longText={true}
                        />
                    </View>
                    <Text style={styles.descText}>Enter your new phone number and we will send you a verification code.</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            keyboardType={'phone-pad'}
                            style={styles.input}
                            value={number}
                            placeholder={'Number'}
                            onChangeText={(text) => this.changeNumber(text)}
                            placeholderTextColor={iconsColors.gray}
                        />
                    </View>
                    {errorText?<Text style={styles.errorText}>{errorText}</Text>:null}
                </View>
                <View style={[styles.footer,keyboardShow && DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?{marginBottom: sizes.size10}:null]}>
                    <GradientButton
                        title={'Receive Code'.toUpperCase()}
                        disabled={!number}
                        onPress={this.receiveCode}
                    />
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(ChangeRegisteredNumber)
