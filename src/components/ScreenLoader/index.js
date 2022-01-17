import React from 'react';
import {View,ActivityIndicator} from 'react-native';
import styles from './styles';
import {Colors} from '../../assets/RootStyles';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {sizes} from '../../assets/sizes';

const ScreenLoader = ({tabScreen,mediaUi})=>{
    return(
        <View style={[styles.container,mediaUi?styles.mediaBack:null]}>
            <View style={tabScreen?{marginTop: DeviceInfo.ios && DeviceInfo.hasNotch?sizes.size83:sizes.size54}:null}>
                <ActivityIndicator size={'large'} color={Colors.grayText}/>
            </View>
        </View>
    )
};

export {ScreenLoader};

