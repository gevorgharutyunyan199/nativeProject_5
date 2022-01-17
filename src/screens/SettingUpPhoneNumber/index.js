import React, {Component} from 'react';
import {Image, View, Text, BackHandler} from 'react-native';
import styles from './styles';
import {GradientButton, ScreenLoader} from '../../components';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {ORDER_PHONE_NUMBERS, SET_PENDING_TYPE} from "../../actionsTypes";
import ChatService from "../../services/ChatService";

class SettingUpPhoneNumber extends Component {

    state = {
        loaderVisible: true,
        selectedPhoneNumber: ''
    };

    async componentDidMount() {
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

        const {route} = this.props;
        let selectedPhoneNumber = await AsyncStorage.getItem('selectedPhoneNumber');
        this.setState({selectedPhoneNumber: selectedPhoneNumber});
        if(route.params && route.params.dontCallOrder){
            this.setState({
                loaderVisible: false
            })
        }else {
            this.props.makeAction(ORDER_PHONE_NUMBERS,{
                callback: ()=>{
                    this.setState({
                        loaderVisible: false
                    })
                },
                error: ()=>{
                    this.props.makeAction(SET_PENDING_TYPE,2);
                    this.setState({
                        loaderVisible: false
                    })
                }
            })
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
        BackHandler.exitApp();
        return true;
    }

    numberMask = (item)=>{
        if(item){
            item = `${item}`;
            return `(${item.substring(0,3)}) ${item.substring(3,6)}-${item.substring(6,item.length)}`
        }else {
            return  ''
        }
    };

    goToHomeScreen = async ()=>{
        const {navigation} = this.props;
        await ChatService.setup(true);
        navigation.replace('TabNavigation')
    };

    render() {
        const {signUpData, navigation} = this.props;
        const {type} = signUpData;
        const {selectedPhoneNumber,loaderVisible} = this.state;
        let title = type === 0?'WE’RE ALMOST THERE!':type === 1?'YOU’RE ALL SET':'SOMETHING WENT WRONG';
        let description = type === 0?'Please wait. We are setting up your desired phone number.'
                        :type === 1?'The setup process is successfully completed. Click the button below to enjoy the app.'
                        :'Looks like there is an issue with your selected phone number. Click the button below to choose another number.';

        return (
            <View style={styles.screen}>
                {loaderVisible?<ScreenLoader/>:null}
                <Image style={styles.backgroundImage} source={require('../../assets/images/background1.png')}/>
                <View style={styles.contentContainer}>
                    <View style={styles.container}>
                        {type === 0?<View style={styles.iconContainer}>
                            <Image style={styles.loadingGif} source={require('../../assets/images/loading.gif')}/>
                        </View>:null}
                        {type === 1?<Image style={styles.iconStyle} source={require('../../assets/images/success.png')}/>:null}
                        {type === 2?<Image style={[styles.iconStyle, {borderWidth: 0}]} source={require('../../assets/images/wrong.png')}/>:null}
                        <Text style={styles.title}>{title.toUpperCase()}</Text>
                        <Text style={styles.description}>{description}</Text>
                        <Text style={[styles.number,type === 2?styles.wrong:null]}>{this.numberMask(selectedPhoneNumber)}</Text>
                    </View>
                    <View style={styles.footer}>
                        {type === 1?<GradientButton title={'START JOURNEY'} onPress={this.goToHomeScreen}/>:null}
                        {type === 2?<GradientButton title={'CHOOSE NUMBER'} onPress={()=>{navigation.navigate('SignUpStep1')}}/>:null}
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = store =>{
    return {
        signUpData: store.SignUpReducer
    }
};

export default connect(mapStateToProps,{makeAction})(SettingUpPhoneNumber)
