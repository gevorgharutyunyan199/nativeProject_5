import React from 'react';
import {View,TouchableOpacity,Text} from 'react-native';
import styles from './styles';
import {Cancel,Back} from '../../assets/icons';
import {sizes} from '../../assets/sizes';
import {iconsColors} from '../../assets/RootStyles';

const ScreenHeader = ({title,leftIcon,leftIconPress,color,fontSize,fontWeight})=>{
    return(
        <View>
            <View style={styles.buttonContainer}>
                {leftIcon?<TouchableOpacity style={styles.iconContainer} onPress={leftIconPress}>
                    {leftIcon === 'Cancel'?<Cancel width={sizes.size32} height={sizes.size32} color={color?color:iconsColors.gray} />:null}
                    {leftIcon === 'Back'?<Back width={sizes.size32} height={sizes.size32} color={color?color:iconsColors.gray} />:null}
                </TouchableOpacity>:null}
            </View>
            <View style={styles.titleContainer}>
                <Text style={[styles.title,color?{color:color}:null,fontSize?{fontSize: fontSize}:null,fontWeight?{fontWeight: fontWeight}:null]}>{title}</Text>
            </View>
        </View>
    )
};

export {ScreenHeader}
