import React from 'react';
import { useSelector } from 'react-redux';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import styles from "./styles";
import {PhotoMessage, VideoMessage} from "../../assets/icons";
import {sizes} from "../../assets/sizes";
import NavigationService from "../../services/NavigationService";
import store from "../../redux";
import {SET_ACTIVE_CHAT_ID, SET_ACTIVE_CHAT_LIST_DATA} from "../../actionsTypes";
import NotificationService from "../../services/NotificationService";
import {DeviceInfo} from "../../assets/DeviceInfo";
import ChatService from "../../services/ChatService";

const InAppNotificationComponent = ()=>{
    const notificationInfo = useSelector(state=>state.UserInfoReducer.inAppNotificationData);
    const activeChatId = useSelector(state=>state.ChatReducer.activeChatId);

    const notificationPress = ()=>{
        if(notificationInfo.type === 'message'){
            const filter = { cid: { $in: [notificationInfo.chat] } };
            const sort = [{ last_message_at: -1 }];
            if(activeChatId && activeChatId !== notificationInfo.chat){
                store.dispatch({ type: SET_ACTIVE_CHAT_ID, payload: notificationInfo.chat});
                let timer  = setInterval(async ()=>{
                    try{
                        const chatData = await ChatService.chatClient.queryChannels(filter, sort, {
                            watch: true,
                            state: true,
                        });

                        if(NavigationService.navigation){
                            NavigationService.navigation.replace('ChannelScreen',{channel: chatData[0]})
                        }
                        clearInterval(timer)
                    }catch (e){
                        console.log(e)
                    }
                },300)
                NotificationService.inAppNotification.hide();
                return
            }
            store.dispatch({ type: SET_ACTIVE_CHAT_ID, payload: notificationInfo.chat});
            store.dispatch({ type: SET_ACTIVE_CHAT_LIST_DATA, payload: []});
            let timer  = setInterval(async ()=>{
                try{
                    const chatData = await ChatService.chatClient.queryChannels(filter, sort, {
                        watch: true,
                        state: true,
                    });

                    if(NavigationService.navigation){
                        NavigationService.navigation.navigate('ChannelScreen',{channel: chatData[0]})
                    }
                    clearInterval(timer)
                }catch (e){
                    console.log(e)
                }
            },300)
        }else if(notificationInfo.type === 'voicemail'){
            NavigationService.navigation.navigate('HistoryStack')
        }else if(notificationInfo.type === 'missed'){
            NavigationService.navigation.navigate('HistoryStack')
        }
        NotificationService.inAppNotification.hide()
    };

    return (
        notificationInfo.notification?<TouchableWithoutFeedback onPress={notificationPress}>
            <View style={styles.notificationContainer}>
                <View style={styles.notificationContent}>
                    <View>
                        <Text style={styles.notificationInfoName}>{notificationInfo.notification.title}</Text>
                        <View style={styles.notificationContentContainer}>
                            <Text style={styles.notificationInfoMessage} numberOfLines={1} ellipsizeMode="tail">{notificationInfo.notification.body}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>:null
    )
};

export {InAppNotificationComponent}
