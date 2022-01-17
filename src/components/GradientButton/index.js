import React from 'react';
import {TouchableOpacity, View, Text, ActivityIndicator} from 'react-native';
import styles from './styles';
import LinearGradient from "react-native-linear-gradient";
import {sizes} from '../../assets/sizes';
import {Colors} from '../../assets/RootStyles';

const GradientButton = ({dontShowLoadingIndicator,title,disabled,onPress,loadingIndicator,style,labelStyle,indicatorColor})=>{
    return(
        <TouchableOpacity onPress={onPress} disabled={disabled || loadingIndicator}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={disabled?[Colors.inactiveButton,Colors.inactiveButton]:[Colors.appColor1, Colors.appColor2]} style={{borderRadius: sizes.size25}}>
                <View style={style?[styles.buttonStyle,...style]:styles.buttonStyle}>
                    {!dontShowLoadingIndicator && loadingIndicator?<ActivityIndicator size={'small'} color={indicatorColor?indicatorColor:Colors.white}/>:<Text style={[styles.buttonText, disabled?styles.buttonTextInactive:null,labelStyle?labelStyle:null]}>{title}</Text>}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
};

export {GradientButton};
