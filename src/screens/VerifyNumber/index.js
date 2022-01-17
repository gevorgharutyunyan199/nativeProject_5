import React, {Component} from 'react';
import {
    KeyboardAvoidingView,
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Alert
} from 'react-native';
import styles from './styles';
import {ScreenHeader, ScreenLoader, GradientButton, TabScreenHeader} from '../../components';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {makeAction} from '../../makeAction';
import {connect} from 'react-redux';
import {Colors} from "../../assets/RootStyles";
import {
    SEND_VERIFICATION_SMS,
    SIGN_UP,
    GET_CURRENT_USER,
    CHECK_SMS_TOKEN_CHANGE_NUMBER,
    CHANGE_REGISTERED_NUMBER
} from "../../actionsTypes";

class VerifyNumber extends Component{

    state = {
        codeSMS: '',
        time: 0,
        codeSent: false,
        loaderVisible: false,
        errorText: '',
        code0: '',
        code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: '',
        maxLengthInput:1
    };

    componentDidMount() {
        this.textInput0.focus();
        if(DeviceInfo.android){
            this.setState({
                maxLengthInput: 6
            })
        }
    }

    componentWillUnmount() {
        if(this.timer){
            clearInterval(this.timer)
        }
    }

    startTimer = ()=>{
        this.setState({
            time: 60,
            codeSent: true,
            code0: '',
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            codeSMS: ''
        });
        this[`textInput0`].focus();
        this.timer = setInterval(()=>{
            this.setState({
                time: this.state.time - 1
            },()=>{
                if(this.state.time === 0){
                    clearInterval(this.timer);
                    this.setState({
                        codeSent: false
                    })
                }
            })
        },1000)
    };

    onChange = (text,index)=>{
        if(DeviceInfo.android){
            if(index === 5){
                this.setState({maxLengthInput:1})
            }
            if(index === 0){
                this.setState({
                    maxLengthInput:6
                })
            }
            if(text.length === 6){
                const [code0, code1, code2, code3, code4, code5] = text;
                this.setState({code0, code1, code2, code3, code4, code5,maxLengthInput:1});
                this[`textInput${5}`].focus();
                return
            }
        }
        if(index<5 && text){
            this[`textInput${index+1}`].focus()
        }
        this.setState({
            [`code${index}`]: text,
            errorText: ''
        })
    };

    _onKeyPress = (e, index)=>{
        if(e.nativeEvent.key !== 'Backspace'){
            this.setState({
                codeSMS: `${this.state.codeSMS}${e.nativeEvent.key}`
            },()=>{
                if(this.state.codeSMS.length === 6){
                    for(let i = 0; i < 6; i++){
                        this.setState({
                            [`code${i}`]: this.state.codeSMS[i]
                        })
                    }
                    this[`textInput5`].focus()
                }
            })
        }else {
            this.setState({
                codeSMS: ''
            })
        }
        if(e.nativeEvent.key !== 'Backspace' && this.state[`code${index}`]){
            if(index<5){
                this[`textInput${index+1}`].focus();
                if(DeviceInfo.ios) {
                    this.setState({
                        [`code${index + 1}`]: e.nativeEvent.key
                    })
                }
            }
        }
        if (e.nativeEvent.key === 'Backspace' && index>0) {
            this[`textInput${index-1}`].focus()
        }
    };

    verify = ()=>{
        const {navigation,makeAction,route} = this.props;
        const {code0,code1,code2,code3,code4,code5} = this.state;
        let code = `${code0}${code1}${code2}${code3}${code4}${code5}`;

        this.setState({
            loaderVisible: true
        });

        if(route.params?.type === 'changeNumber'){
            makeAction(CHECK_SMS_TOKEN_CHANGE_NUMBER,{
                callback: ()=>{
                    try {
                        makeAction(CHANGE_REGISTERED_NUMBER,{
                            callback: ()=>{
                                makeAction(GET_CURRENT_USER,{
                                    callback: ()=>{
                                        try {
                                            this.setState({
                                                loaderVisible: false
                                            });
                                            Alert.alert(
                                                "Success",
                                                "Your registered number is \nsuccessfully changed."
                                            );
                                            navigation.navigate('SettingsStack')
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
                                    }
                                })
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
                            number: route.params.number
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
                code: code,
                number: route.params.number
            })
        }else {
            makeAction(SIGN_UP,{
                code: code,
                callback: ()=>{
                    try {
                        makeAction(GET_CURRENT_USER,{
                            callback: ()=>{
                                try {
                                    navigation.navigate('SubscriptionPage');
                                    this.setState({
                                        loaderVisible: false
                                    })
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
                            errorText: e.response.data.errorCode === "UMSU5"?'Incorrect verification code. Please try again.':e.response.data.errorMessage
                        })
                    }else {
                        this.setState({
                            loaderVisible: false
                        })
                    }
                }
            })
        }
    };

    resendCode = ()=>{
        this.startTimer();
        this.props.makeAction(SEND_VERIFICATION_SMS,{
            callback: (data)=>{},
            error: ()=>{}
        })
    };

    renderInputs = ()=>{
        let inputs = [];
        const {maxLengthInput} = this.state;
        for(let i = 0; i < 6; i++){
            inputs.push(
                <TouchableWithoutFeedback key={i.toString()} onPress={()=>{this[`textInput${i}`].focus()}}>
                    <View style={[styles.inputContainerStyle,this.state.errorText?{borderColor: Colors.wrong}:null]}>
                        <TextInput
                            ref={(input)=>{this[`textInput${i}`] = input}}
                            style={[styles.input]}
                            selectionColor={Colors.black}
                            keyboardType={'number-pad'}
                            maxLength={DeviceInfo.ios ? 1 : maxLengthInput }
                            value={this.state[`code${i}`]}
                            onChangeText={text => this.onChange(text,i)}
                            onKeyPress={(e) => this._onKeyPress(e,i)}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        return inputs
    };

    render() {
        const {navigation, route} = this.props;
        const {loaderVisible,errorText,codeSent,time,code0,code1,code2,code3,code4,code5} = this.state;
        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                <View style={styles.screen}>
                    {loaderVisible?<ScreenLoader/>:null}
                    {route.params?.type === 'changeNumber'?<View style={styles.headerContainer}>
                        <TabScreenHeader
                            title={'Change Registered Number'}
                            leftIcon={'back'}
                            leftIconPress={()=>{
                                navigation.goBack()
                            }}
                            longText={true}
                        />
                    </View>:<ScreenHeader
                        title={'Verify Number'}
                        leftIcon={'Back'}
                        leftIconPress={()=>{navigation.goBack()}}
                    />}
                    <Text style={styles.grayText}>{route.params?.type === 'changeNumber'?'Enter the verification code below to save your new phone number.':'Enter the 6-digit verification code sent to your phone.'}</Text>
                    <View style={styles.inputsContainer}>
                        {
                            this.renderInputs()
                        }
                    </View>
                    {errorText?<Text style={styles.errorText}>{errorText}</Text>:null}
                    <View style={[styles.resendContainer,errorText?styles.resendContainerError:null]}>
                        <TouchableOpacity onPress={this.resendCode} disabled={codeSent}>
                            <Text style={[styles.resend,codeSent?{color: Colors.black}:null]}>Resend Code {codeSent?time<10?`(0${time})`:`(${time})`:null}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    {loaderVisible?<View style={styles.loaderFooter}/>:null}
                    <GradientButton
                        title={route.params?.type === 'changeNumber'?'save'.toUpperCase():'verify'.toUpperCase()}
                        disabled={!code0 || !code1 || !code2 || !code3 || !code4 || !code5}
                        onPress={this.verify}
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

export default connect(mapStateToProps,{makeAction})(VerifyNumber)
