import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from './styles';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {useSelector} from 'react-redux';

const TabBarr = ({active, text1, text2, tabPress})=>{

    const userInfo = useSelector(store=>store.UserInfoReducer);

    return(
        <View style={styles.contentContainer}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.tabButton} onPress={()=>{tabPress(1)}}  disabled={active===1}>
                    <Text style={[styles.itemText,active===1?styles.activeColor:null]}>{DeviceInfo.ios?text1:text1.toUpperCase()}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton} onPress={()=>{tabPress(2)}}  disabled={active===2}>
                    <Text style={[styles.itemText,active===2?styles.activeColor:null]}>{DeviceInfo.ios?text2:text2.toUpperCase()}</Text>
                    {DeviceInfo.android && userInfo.unreadVoicemailCount && text2 === 'Voicemail'?<View style={[styles.badge,`${userInfo.unreadVoicemailCount}`.length === 1?styles.singleDigitNumberBadge:null]}>
                        <Text style={styles.badgeText}>{userInfo.unreadVoicemailCount}</Text>
                    </View>:null}
                </TouchableOpacity>
            </View>
            <View style={[styles.barrSliderContainer,active===2?{alignItems: 'flex-end'}:null]}>
                <View style={styles.barrSlider}/>
            </View>
        </View>
    )
};

export {TabBarr};

