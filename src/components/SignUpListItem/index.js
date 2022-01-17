import React from 'react';
import {TouchableOpacity,Text} from 'react-native';
import styles from './styles';
import {ArrowRight} from '../../assets/icons';
import {iconsColors} from '../../assets/RootStyles';
import {sizes} from '../../assets/sizes';

const SignUpListItem = ({title,onPress})=>{
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{title}</Text>
            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
        </TouchableOpacity>
    )
};

export {SignUpListItem};

