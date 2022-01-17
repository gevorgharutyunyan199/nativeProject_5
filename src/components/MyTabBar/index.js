import React, { useState, useEffect } from 'react';
import {View, TouchableWithoutFeedback, Text, Keyboard} from 'react-native';
import styles from './styles';
import {
    MessagesInactive,
    ContactsInactive,
    KeypadInactive,
    HistoryInactive,
    SettingsInactive,
    MessagesActive,
    ContactsActive,
    KeypadActive,
    HistoryActive,
    SettingsActive
} from '../../assets/icons';
import {sizes} from "../../assets/sizes";
import {useSelector} from 'react-redux';
import {DeviceInfo} from "../../assets/DeviceInfo";
import store from "../../redux";
import {SET_SCROLL_REF} from "../../actionsTypes";

const MyTabBar = (props)=>{
    const [show, setShow] = useState(true);
    const routName =  props.state.routes[props.state.index].name;
    const {navigation} = props;
    const userInfo = useSelector(store=>store.UserInfoReducer);
    const ActionsReducer = useSelector(store=>store.ActionsReducer);

    if(DeviceInfo.android){
        useEffect(() => {
            let keyboardListenerShow = Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
            let keyboardListenerHide = Keyboard.addListener('keyboardDidHide',_keyboardDidHide);
            return () => {
                keyboardListenerShow?.remove();
                keyboardListenerHide?.remove();
            };
        }, []);
    }

    const _keyboardDidShow = () => {
        try {
            setShow(false)
        }catch (e) {
            console.log(e)
        }
    };

    const _keyboardDidHide = () => {
        try {
            setShow(true)
        }catch (e) {
            console.log(e)
        }
    };

    const goToScreen = (name)=>{
        if(routName === name){
            if(ActionsReducer.scrollRef && ActionsReducer.scrollRef.scrollToOffset){
                ActionsReducer.scrollRef.scrollToOffset({ animated: true, y: 0 });
            }
            return
        }
        store.dispatch({
            type: SET_SCROLL_REF,
            payload: null
        });
        navigation.navigate(name)
    };

    return(
        show?<View style={styles.contentContainer}>
            <TouchableWithoutFeedback onPress={()=>{goToScreen('MessagesStack')}}>
                <View style={styles.button}>
                    {userInfo.unreadMessagesCount > 0?<View style={[styles.badge,`${userInfo.unreadMessagesCount}`.length === 1?styles.singleDigitNumberBadge:null]}>
                        <Text style={styles.badgeText}>{userInfo.unreadMessagesCount>99?'99+':userInfo.unreadMessagesCount}</Text>
                    </View>:null}
                    {routName === 'MessagesStack'?<MessagesActive width={sizes.size75} height={sizes.size49}/>:<MessagesInactive width={sizes.size75} height={sizes.size49}/>}
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>{goToScreen('ContactsStack')}}>
                <View style={styles.button}>
                    {routName === 'ContactsStack'?<ContactsActive width={sizes.size75} height={sizes.size49}/>:<ContactsInactive width={sizes.size75} height={sizes.size49}/>}
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>{goToScreen('KeypadStack')}}>
                <View style={styles.button}>
                    {routName === 'KeypadStack'?<KeypadActive width={sizes.size75} height={sizes.size49}/>:<KeypadInactive width={sizes.size75} height={sizes.size49}/>}
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>{goToScreen('HistoryStack')}}>
                <View style={styles.button}>
                    {userInfo.unreadHistoryCount > 0 && DeviceInfo.ios?<View style={[styles.badge,styles.singleDigitNumberBadge]}>
                        <Text style={styles.badgeText}>{userInfo.unreadHistoryCount>99?'99+':userInfo.unreadHistoryCount}</Text>
                    </View>:null}
                    {routName === 'HistoryStack'?<HistoryActive width={sizes.size75} height={sizes.size49}/>:<HistoryInactive width={sizes.size75} height={sizes.size49}/>}
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={()=>{goToScreen('SettingsStack')}}>
                <View style={styles.button}>
                    {routName === 'SettingsStack'?<SettingsActive width={sizes.size75} height={sizes.size49}/>:<SettingsInactive width={sizes.size75} height={sizes.size49}/>}
                </View>
            </TouchableWithoutFeedback>
        </View>:null
    )
};

export {MyTabBar};
