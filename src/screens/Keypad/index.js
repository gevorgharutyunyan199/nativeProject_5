import React, {Component} from 'react';
import {View, TouchableOpacity, Image, Text, ImageBackground, ActivityIndicator} from 'react-native';
import styles from './styles';
import AlertService from '../../services/AlertService';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {Colors} from "../../assets/RootStyles";
import {Asterisk, Hashtag} from "../../assets/icons";
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {GENERATE_OUTGOING_CALL_NUMBER} from "../../actionsTypes";
import Sound from "react-native-sound";

const keySounds = {
  '0': require('../../assets/sound/keypad/abto_dtmf-0.wav'),
  '1': require('../../assets/sound/keypad/abto_dtmf-1.wav'),
  '2': require('../../assets/sound/keypad/abto_dtmf-2.wav'),
  '3': require('../../assets/sound/keypad/abto_dtmf-3.wav'),
  '4': require('../../assets/sound/keypad/abto_dtmf-4.wav'),
  '5': require('../../assets/sound/keypad/abto_dtmf-5.wav'),
  '6': require('../../assets/sound/keypad/abto_dtmf-6.wav'),
  '7': require('../../assets/sound/keypad/abto_dtmf-7.wav'),
  '8': require('../../assets/sound/keypad/abto_dtmf-8.wav'),
  '9': require('../../assets/sound/keypad/abto_dtmf-9.wav'),
  'star': require('../../assets/sound/keypad/abto_dtmf-star.wav'),
  'pound': require('../../assets/sound/keypad/abto_dtmf-pound.wav'),
};

class Keypad extends Component {

    state = {
        number: '',
        callLoader: false
    };

    handleChange = (num)=>{
        this.sound = new Sound(keySounds[num==='*'?'star':num==='#'?'pound':num],()=>{
            this.sound.setVolume(0.02);
            this.sound.play(()=>{})
        });
        const {number} = this.state;
        this.setState({
            number: number + num
        })
    };

    handleRemove = ()=>{
        const {number} = this.state;
        this.setState({
            number: number.substring(0, number.length - 1)
        })
    };

    call = async ()=>{
        const {number} = this.state;
        if(number){
            this.setState({
                callLoader: true
            })
            this.props.makeAction(GENERATE_OUTGOING_CALL_NUMBER,{
                callback: async (data)=>{
                    await AlertService.call(data.imrn);
                    this.setState({
                        callLoader: false
                    });
                },
                error: ()=>{
                    this.setState({
                        callLoader: false
                    });
                },
                number: number
            });
        }
    };


    render() {
        const {number,callLoader} = this.state;

        return (
            <View style={styles.screen}>
                <View style={styles.topContainer}>
                    <Text selectable style={[styles.number,number.length>11?styles.numberMedium:null,number.length>14?styles.numberSmall:null]} ellipsizeMode={'head'} numberOfLines={1}>{number}</Text>
                </View>
                <View style={styles.keypadContainer}>
                    <ImageBackground source={require('../../assets/images/rectangle.png')} style={styles.imageBackground}>
                        <View style={styles.keypadRow}>
                            <TouchableOpacity onPress={()=>{this.handleChange('1')}} style={styles.button}>
                                <Text style={styles.textNumber}>1</Text>
                                <Text style={styles.numberDesc}> </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('2')}} style={styles.button}>
                                <Text style={styles.textNumber}>2</Text>
                                <Text style={styles.numberDesc}>A B C</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('3')}} style={styles.button}>
                                <Text style={styles.textNumber}>3</Text>
                                <Text style={styles.numberDesc}>D E F</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.keypadRow}>
                            <TouchableOpacity onPress={()=>{this.handleChange('4')}} style={styles.button}>
                                <Text style={styles.textNumber}>4</Text>
                                <Text style={styles.numberDesc}>G H I</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('5')}} style={styles.button}>
                                <Text style={styles.textNumber}>5</Text>
                                <Text style={styles.numberDesc}>J K L</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('6')}} style={styles.button}>
                                <Text style={styles.textNumber}>6</Text>
                                <Text style={styles.numberDesc}>M N O</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.keypadRow}>
                            <TouchableOpacity onPress={()=>{this.handleChange('7')}} style={styles.button}>
                                <Text style={styles.textNumber}>7</Text>
                                <Text style={styles.numberDesc}>P Q R S</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('8')}} style={styles.button}>
                                <Text style={styles.textNumber}>8</Text>
                                <Text style={styles.numberDesc}>T U V</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('9')}} style={styles.button}>
                                <Text style={styles.textNumber}>9</Text>
                                <Text style={styles.numberDesc}>W X Y Z</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.keypadRow}>
                            <TouchableOpacity onPress={()=>{this.handleChange('*')}} style={styles.button}>
                                <Asterisk width={DeviceInfo.ios?sizes.size17:sizes.size20} height={sizes.size17}/>
                                <Text style={styles.numberDesc}> </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('0')}} onLongPress={()=>{this.handleChange('+')}} style={styles.button}>
                                <Text style={styles.textNumber}>0</Text>
                                <Text style={styles.numberDesc}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.handleChange('#')}} style={styles.button}>
                                <Hashtag width={sizes.size18} height={sizes.size16p9}/>
                                <Text style={styles.numberDesc}> </Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={this.call} disabled={callLoader}>
                            {callLoader?<View style={styles.callLoaderContainer}>
                                <ActivityIndicator size={'small'} color={Colors.white}/>
                            </View>:<Image style={styles.itemImage} source={require('../../assets/images/call.png')}/>}
                        </TouchableOpacity>
                        {number?<TouchableOpacity style={styles.removeButton} onPress={this.handleRemove} onLongPress={()=>{this.setState({number: ''})}}>
                            <Image style={styles.remove} source={require('../../assets/images/remove.png')}/>
                        </TouchableOpacity>:null}
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(Keypad)
