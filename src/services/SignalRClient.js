import AsyncStorage from '@react-native-async-storage/async-storage';
import {Vibration, AppState} from 'react-native';
import * as signalR from "@microsoft/signalr";
import store from "../redux";
import NotificationService from "./NotificationService";
import {
    GET_BADGES,
    SET_IN_APP_NOTIFICATION_DATA,
    SET_PENDING_TYPE,
    REFRESH_SIGNALR_TOKEN,
    ADD_CALL,
    ADD_VOICEMAIL,
    SET_UNREAD_MESSAGES_COUNT,
    SET_UNREAD_HISTORY_COUNT,
    SET_UNREAD_VOICEMAIL_COUNT
} from '../actionsTypes';
import ContactsService from "./ContactsService";
import {DeviceInfo} from "../assets/DeviceInfo";

class _SignalRClient {
    hubConnection = null;
    refreshChats = null;
    inAppNotification = null;

    async init(){
        let signalRData = await AsyncStorage.getItem('signalRData');
        if(signalRData && !this.hubConnection){
            signalRData = JSON.parse(signalRData);
            try {
                this.hubConnection = new signalR.HubConnectionBuilder().withUrl(signalRData.url,{
                    transport: signalR.HttpTransportType.WebSockets,
                    skipNegotiation: true,
                    accessTokenFactory: () => signalRData.accessToken
                }).withAutomaticReconnect().build();

                this.hubConnection.onreconnecting(async (error) => {
                    await this.init();
                    console.log('reconnecting',error)
                });

                this.hubConnection.onreconnected(connectionId => {
                    console.log('reconnected',connectionId)
                });

                this.hubConnection.on("ordering", (data) => {
                    store.dispatch({ type: SET_PENDING_TYPE, payload: data.success?1:2});
                });

                this.hubConnection.on("badge-update", (data) => {
                    store.dispatch({type: SET_UNREAD_MESSAGES_COUNT, payload: data.data.unseenChatsCount});
                    store.dispatch({type: SET_UNREAD_HISTORY_COUNT, payload: +data.data.unreadVoicemailsCount + (+data.data.unseenMissedCallsCount)});
                    store.dispatch({type: SET_UNREAD_VOICEMAIL_COUNT, payload: data.data.unreadVoicemailsCount});
                    if(DeviceInfo.ios){
                        NotificationService.setApplicationIconBadgeNumber(+data.data.unseenChatsCount + +data.data.unreadVoicemailsCount + +data.data.unseenMissedCallsCount)
                    }
                });

                this.hubConnection.on("call-missed", (data) => {
                    let appState = AppState.currentState;

                    if(appState === 'active'){
                        store.dispatch({
                            type: SET_IN_APP_NOTIFICATION_DATA,
                            payload: {
                                notification: data,
                                type: 'missed'
                            }
                        });

                        store.dispatch({type: SET_UNREAD_MESSAGES_COUNT, payload: data.data.unseenChatsCount});
                        store.dispatch({type: SET_UNREAD_HISTORY_COUNT, payload: +data.data.unreadVoicemailsCount + (+data.data.unseenMissedCallsCount + 1)});
                        store.dispatch({type: SET_UNREAD_VOICEMAIL_COUNT, payload: data.data.unreadVoicemailsCount});

                        let serializedObject = JSON.parse(data?.data.serializedObject)
                        if(serializedObject.countryCode){
                            serializedObject.contact = ContactsService.getContactByNumber(`+${serializedObject.countryCode}${serializedObject.phoneNumber}`)
                        }
                        if(!serializedObject.contact){
                            serializedObject.contact = ContactsService.getContactByNumber(serializedObject.phoneNumber)
                        }

                        store.dispatch({
                            type: ADD_CALL,
                            payload: serializedObject
                        });

                        if(this.inAppNotification){
                            this.inAppNotification.show();
                            this.vibrate()
                        }
                    }
                });

                this.hubConnection.on("voicemail-received", (data) => {
                    let appState = AppState.currentState;
                    store.dispatch({type: GET_BADGES});
                    if(appState === 'active'){
                        store.dispatch({
                            type: SET_IN_APP_NOTIFICATION_DATA,
                            payload: {
                                notification: data,
                                type: 'voicemail'
                            }
                        });

                        store.dispatch({type: SET_UNREAD_MESSAGES_COUNT, payload: data.data.unseenChatsCount});
                        store.dispatch({type: SET_UNREAD_HISTORY_COUNT, payload: (+data.data.unreadVoicemailsCount + 1) + +data.data.unseenMissedCallsCount});
                        store.dispatch({type: SET_UNREAD_VOICEMAIL_COUNT, payload: data.data.unreadVoicemailsCount});

                        let serializedObject = JSON.parse(data?.data.serializedObject)
                        serializedObject.contact = ContactsService.getContactByNumber(serializedObject.phoneNumber)

                        store.dispatch({
                            type: ADD_VOICEMAIL,
                            payload: serializedObject
                        });

                        if(this.inAppNotification){
                            this.inAppNotification.show();
                            this.vibrate()
                        }
                    }
                });

                this.hubConnection.on("message-sent", (data) => {
                    let appState = AppState.currentState;
                    if(data.data.cid !== store.getState().ChatReducer.activeChatId){
                        store.dispatch({type: GET_BADGES});
                        if(appState === 'active'){
                            store.dispatch({
                                type: SET_IN_APP_NOTIFICATION_DATA,
                                payload: {
                                    chat: data.data.cid,
                                    contact: null,
                                    notification: data,
                                    type: 'message'
                                }
                            });
                            if(this.inAppNotification){
                                this.inAppNotification.show();
                                this.vibrate();
                            }
                        }
                    }
                });

                this.hubConnection.onclose(()=>{store.dispatch({ type: REFRESH_SIGNALR_TOKEN })});

                await this.start();
            }catch (e) {
                console.log(e)
            }
        }
    }

    async start(){
        if(this.hubConnection){
            try {
                await this.hubConnection.start();
                console.log("SignalR Connected.");
            } catch (err) {
                console.log(err);
                store.dispatch({ type: REFRESH_SIGNALR_TOKEN })
            }
        }
    }

    async stop(){
        if(this.hubConnection){
            await this.hubConnection.stop().then(()=>{
                this.hubConnection = null;
            });
        }
    }

    vibrate = ()=>{
        Vibration.vibrate([0]);
        if(NotificationService.sound && NotificationService.sound.play){
            NotificationService.sound.play()
        }
    };

    getChatsListFunctionInit = (f)=>{
        this.refreshChats = f
    };

    setupInAppNotification = (inAppNotification)=>{
        this.inAppNotification = inAppNotification
    }
}

const SignalRClient = new _SignalRClient();

export default SignalRClient;
