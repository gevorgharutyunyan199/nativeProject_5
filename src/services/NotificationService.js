import messaging from "@react-native-firebase/messaging";
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from "../redux";
import Sound from "react-native-sound";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import NavigationService from "./NavigationService";
import {
    SET_ACTIVE_CHAT_ID,
    SET_ACTIVE_CHAT_LIST_DATA,
    SET_IN_APP_NOTIFICATION_DATA
} from "../actionsTypes";
import ChatService from "./ChatService";


class _NotificationService {

    inAppNotification = null;
    enabled = false;
    sound = new Sound(require('../assets/sound/iphone_notification.mp3'));

    setup = async ()=>{
        await this.requestPermission();
    };

    notificationPress = (notificationInfo)=>{
        store.dispatch({
            type: SET_IN_APP_NOTIFICATION_DATA,
            payload: notificationInfo
        });

        setTimeout(()=>{
            store.dispatch({
                type: SET_IN_APP_NOTIFICATION_DATA,
                payload: {}
            });
        },2000);
        let activeChatId = store.getState().ChatReducer.activeChatId;
        if(notificationInfo.type === 'message'){
            if(activeChatId && activeChatId !== notificationInfo.chat.cid){
                store.dispatch({ type: SET_ACTIVE_CHAT_ID, payload: notificationInfo.chat.cid});
                store.dispatch({ type: SET_ACTIVE_CHAT_LIST_DATA, payload: []});
                if(NavigationService.navigation){
                    NavigationService.navigation.replace('ChannelScreen',{channel: notificationInfo.chat})
                }
                return
            }
            store.dispatch({ type: SET_ACTIVE_CHAT_ID, payload: notificationInfo.chat.cid});
            if(NavigationService.navigation){
                NavigationService.navigation.navigate('ChannelScreen',{channel: notificationInfo.chat})
            }
        }else if(notificationInfo.type === 'voicemail'){
            NavigationService.navigation.navigate('HistoryStack')
        }else if(notificationInfo.type === 'missed'){
            NavigationService.navigation.navigate('HistoryStack')
        }
    };

    requestPermission = async ()=>{
        const authStatus = await messaging().requestPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        this.enabled = enabled;
        if (enabled) {
            this.getToken();
            messaging().getInitialNotification().then(remoteMessage=>{
                if(remoteMessage){
                    this.interval = setInterval(()=>{
                        if(NavigationService.navigation){
                            clearInterval(this.interval);
                            this.handleNotification(remoteMessage)
                        }
                    },100)
                }
            });
            messaging().onNotificationOpenedApp(remoteMessage => {
                let data = remoteMessage.data;
                if(!store.getState().ChatReducer.activeChatId || store.getState().ChatReducer.activeChatId!==data.chatId){
                    this.handleNotification(remoteMessage)
                }
            });
        }
    };

    handleNotification = async (remoteMessage)=>{
        if(remoteMessage.data.type === "message-sent"){
            let data = remoteMessage.data;
            const filter = { cid: { $in: [data.cid] } };
            const sort = [{ last_message_at: -1 }];
            let timer  = setInterval(async ()=>{
                try{
                    const chatData = await ChatService.chatClient.queryChannels(filter, sort, {
                        watch: true,
                        state: true,
                    });

                    let notificationInfo = {
                        chat: chatData[0],
                        type: 'message'
                    };
                    this.notificationPress(notificationInfo);
                    clearInterval(timer)
                }catch (e){
                    console.log(e)
                }
            },300)
        }else if(remoteMessage.data.type === "call-missed"){
            let notificationInfo = {
                notification: {},
                type: 'missed'
            };
            this.notificationPress(notificationInfo)
        }else if(remoteMessage.data.type === "voicemail-received"){
            let notificationInfo = {
                notification: {},
                type: 'voicemail'
            };
            this.notificationPress(notificationInfo)
        }
    };

    getToken = ()=>{
        messaging().getToken().then(async (token) => {
            if (token) {
                await AsyncStorage.setItem('tokenFCM', token);
            }
        });
    };

    setApplicationIconBadgeNumber = (val)=>{
        PushNotificationIOS.checkPermissions((res)=>{
            if(res.badge){
                PushNotificationIOS.setApplicationIconBadgeNumber(val)
            }
        })
    };

    setupInAppNotification = (inAppNotification)=>{
        this.inAppNotification = inAppNotification
    };

    hideInAppNotification = ()=>{
        setTimeout(()=>{
            store.dispatch({
                type: SET_IN_APP_NOTIFICATION_DATA,
                payload: {}
            });
        },1000)
    }
}

const NotificationService = new _NotificationService();

export default NotificationService;
