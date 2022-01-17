import React, {Component} from 'react';
import {KeyboardAvoidingView, Text, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, ScrollView} from 'react-native';
import styles from './styles';
import {ScreenHeader,ScreenLoader, GradientButton} from '../../components';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {makeAction} from '../../makeAction';
import {connect} from 'react-redux';
import {sizes} from "../../assets/sizes";
import {Colors} from "../../assets/RootStyles";
import {Clear} from "../../assets/icons";
import {
    GET_AREA_CODES_LIST_DATA,
    SET_SELECTED_AREA_CODE,
    CHECK_AREA_CODE, SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA
} from "../../actionsTypes";

class SignUpStep1 extends Component{

    state = {
        recommendations: null,
        loaderVisible: true,
        valid: true,
        code0: '',
        code1: '',
        code2: ''
    };

    componentDidMount() {
        const {route,navigation} = this.props;
        navigation.setOptions({
            gestureEnabled: route.params && route.params.bacButtonHide?false:true
        });
        this.props.makeAction(GET_AREA_CODES_LIST_DATA,{
            callback: ()=>{
                try {
                    this.setState({loaderVisible: false});
                    this.textInput0.focus();
                }catch (e){
                    console.log(e)
                }
            }
        })
    }

    onChange = (text,index)=>{
        if(index<2 && text){
            this[`textInput${index+1}`].focus()
        }
        this.setState({
            [`code${index}`]: text,
            valid: true,
            recommendations: null
        })
    };

    clear = ()=>{
        this.textInput0.focus();
        this.setState({
            code0: '',
            code1: '',
            code2: '',
            valid: true,
            recommendations: null
        })
    };

    _onKeyPress = (e, index)=>{
        if(e.nativeEvent.key !== 'Backspace' && this.state[`code${index}`]){
            if(index<2){
                this[`textInput${index+1}`].focus();
                if(DeviceInfo.ios){
                    this.setState({
                        [`code${index+1}`]: e.nativeEvent.key
                    })
                }
            }
        }
        if (e.nativeEvent.key === 'Backspace' && index>0) {
            this[`textInput${index-1}`].focus()
        }
    };

    recommendationItemPress = (item)=>{
        this.setState({
            code0: `${item}`[0],
            code1: `${item}`[1],
            code2: `${item}`[2]
        },()=>{
            this[`textInput2`].focus();
            this.continuePress();
        })
    };

    continuePress = ()=>{
        const {navigation,signUpData,makeAction} = this.props;
        const {code0,code1,code2,recommendations} = this.state;
        let code = code0 + code1 + code2;
        let index = signUpData.areaCodes.indexOf(parseInt(code));
        if(index>-1){
            if(recommendations){
                this.setState({
                    recommendations: null
                });
                makeAction(SET_SELECTED_AREA_CODE,signUpData.areaCodes[index]);
                makeAction(SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA,[]);
                navigation.navigate('SignUpStep2')
            }else{
                this.setState({
                    loaderVisible: true
                });
                makeAction(CHECK_AREA_CODE,{
                    code: code,
                    callback: (data)=>{
                        try {
                            this.setState({
                                loaderVisible: false
                            });
                            if(data.isAvailable){
                                makeAction(SET_SELECTED_AREA_CODE,signUpData.areaCodes[index]);
                                makeAction(SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA,[]);
                                navigation.navigate('SignUpStep2')
                            }else{
                                this.setState({
                                    recommendations: data.alternative
                                })
                            }
                        }catch (e){
                            console.log(e)
                        }
                    },
                    error: ()=>{
                        this.setState({
                            loaderVisible: false
                        });
                    }
                })
            }
        }else {
            this.setState({
                valid: false
            })
        }
    };

    render() {
        const {navigation,route} = this.props;
        const {loaderVisible,valid,recommendations,code0,code1,code2} = this.state;
        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                <View style={styles.screen}>
                    {loaderVisible?<ScreenLoader/>:null}
                    <ScreenHeader
                        title={'Choose your LineX number'}
                        leftIcon={route.params && route.params.bacButtonHide?'':'Back'}
                        leftIconPress={()=>{navigation.goBack()}}
                    />
                    <ScrollView>
                        <Text style={styles.grayText}>Enter your desired U.S. area code to search for available numbers.</Text>
                        <View style={styles.inputsContainer}>
                            <TouchableWithoutFeedback onPress={()=>{this.textInput0.focus()}}>
                                <View style={[
                                    styles.inputContainerStyle,
                                    code0?{borderColor: Colors.cancel}:null,
                                    !valid?{borderColor: Colors.wrong}:null,
                                    recommendations?{borderColor: Colors.grayBorder}:null
                                ]}>
                                    <TextInput
                                        ref={(input)=>{this.textInput0 = input}}
                                        style={[styles.input,!valid || recommendations?{color: Colors.black}:null]}
                                        selectionColor={Colors.appColor1}
                                        keyboardType={'number-pad'}
                                        maxLength={1}
                                        value={code0}
                                        onChangeText={text => this.onChange(text,0)}
                                        onKeyPress={(e) => this._onKeyPress(e,0)}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.textInput1.focus()}}>
                                <View style={[
                                    styles.inputContainerStyle,
                                    code1?{borderColor: Colors.cancel}:null,
                                    !valid?{borderColor: Colors.wrong}:null,
                                    recommendations?{borderColor: Colors.grayBorder}:null
                                ]}>
                                    <TextInput
                                        ref={(input)=>{this.textInput1 = input}}
                                        style={[styles.input,!valid || recommendations?{color: Colors.black}:null]}
                                        selectionColor={Colors.appColor1}
                                        keyboardType={'number-pad'}
                                        maxLength={1}
                                        value={code1}
                                        onChangeText={text => this.onChange(text,1)}
                                        onKeyPress={(e) => this._onKeyPress(e,1)}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{this.textInput2.focus()}}>
                                <View style={[
                                    styles.inputContainerStyle,
                                    code2?{borderColor: Colors.cancel}:null,
                                    !valid?{borderColor: Colors.wrong}:null,
                                    recommendations?{borderColor: Colors.grayBorder}:null
                                ]}>
                                    <TextInput
                                        ref={(input)=>{this.textInput2 = input}}
                                        style={[styles.input,!valid || recommendations?{color: Colors.black}:null]}
                                        selectionColor={Colors.appColor1}
                                        keyboardType={'number-pad'}
                                        maxLength={1}
                                        value={code2}
                                        onChangeText={text => this.onChange(text,2)}
                                        onKeyPress={(e) => this._onKeyPress(e,2)}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.clear}>
                                {code0 || code1 || code2?<TouchableOpacity onPress={this.clear}>
                                    <Clear width={sizes.size32} height={sizes.size32}/>
                                </TouchableOpacity>:null}
                            </View>
                        </View>
                        {!valid?<Text style={styles.errorText}>Please enter a valid area code to continue</Text>:null}
                        {recommendations?<View>
                            <Text style={styles.recommendationText}>There are no available numbers in this area code. May we suggest others:</Text>
                            <View style={styles.recommendationsRow}>
                                {
                                    recommendations.map((item,index)=>{
                                        if(index<5){
                                            return(
                                                <TouchableOpacity
                                                    key={index.toString()}
                                                    style={styles.recommendationButton}
                                                    onPress={()=>{this.recommendationItemPress(item)}}
                                                >
                                                    <Text style={styles.recommendationButtonText}>{item}</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })
                                }
                            </View>
                        </View>:null}
                    </ScrollView>
                </View>
                <View style={styles.footer}>
                    {loaderVisible?<View style={styles.loaderFooter}/>:null}
                    <GradientButton
                        title={'Continue'.toUpperCase()}
                        disabled={!code0 || !code1 || !code2 || recommendations}
                        onPress={this.continuePress}
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

export default connect(mapStateToProps,{makeAction})(SignUpStep1)
