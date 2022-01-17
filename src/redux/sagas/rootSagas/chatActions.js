import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from "../../../assets/constants";
import HttpClient from "../../../services/HttpClient";
import {DeviceInfo} from "../../../assets/DeviceInfo";
import {put, select} from "redux-saga/effects";
import {
    SET_CHATS,
    SET_ACTIVE_CHAT_LIST_DATA,
    SET_SHOW_CHANNELS_LIST
} from '../../../actionsTypes';

function* getPrivateChat(data) {
    const {callback, error, to, time} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    if(to){
        let url = `${apiUrl}chat/private?To=${encodeURIComponent(to)}`;

        if(time){
            url = `${apiUrl}chat/private?To=${encodeURIComponent(to)}&time=${time}`;
        }

        try {
            let response = yield HttpClient.get(url,{
                headers: {
                    Authorization: `Bearer ${userAccessTokens.access_token}`,
                    DeviceId: DeviceInfo.deviceId
                }
            });

            if(response.status === 200){
                callback(response.data);
            }
        } catch (e) {
            console.log(e.toString(), 'getPrivateChat');
            error(e);
        }
    }
}

function* getChats(data) {
    const {callback, error, page, loadMore,disableLoadMore,searchText} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = '';
    if(searchText){
        url = `${apiUrl}chats?Page=${page}&Search=${searchText}`
    }else{
        url = `${apiUrl}chats?Page=${page}`
    }

    try {
        let response = yield HttpClient.get(url,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            if(loadMore){
                if(!response.data.length){
                    disableLoadMore();
                }
                else{
                    let chats = yield select((store) => store.UserInfoReducer.chats);
                    let newArr = chats.concat(response.data);
                    yield put({type: SET_CHATS, payload: newArr});
                }
                callback();
            }else{
                yield put({type: SET_CHATS, payload: response.data});
                callback();
            }
        }
    } catch (e) {
        console.log(e.toString(), 'getChats');
        error(e);
    }
}

function* sendPrivateMessage(data) {
    const {callback, error, message, resend, messageId} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};
    let body;

    if(resend){
        body = {
            "MessageId": messageId,
            "To": message.to,
            "MessageType": message.type,
            "Content": message.content
        }
    }else{
        body = {
            "To": message.to,
            "MessageType": message.type,
            "Content": message.content
        }
    }

    try {
        let response = yield HttpClient.post(`${apiUrl}message/private`,body,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 200){
            if(resend){
                let listData = yield select((store) => store.ChatReducer.listData);
                let index = listData.findIndex(item=>item.id===messageId);
                if(index>-1){
                    listData[index] = response.data;
                    yield put({type: SET_ACTIVE_CHAT_LIST_DATA, payload: listData});
                }
            }else {
                callback(response.data.message,response.data.chat);
            }
        }
    } catch (e) {
        console.log(e.toString(), 'sendPrivateMessage');
        error(e);
    }
}

function* deleteChatHistory(data) {
    const {callback, error, chatId, index} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}chat?ChatId=${chatId}`;

    try {
        let response = yield HttpClient.delete(url,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            if(index>-1){
                let chats = yield select((store) => store.UserInfoReducer.chats);
                chats.splice(index, 1)
                yield put({type: SET_CHATS, payload: chats});
            }
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'deleteChatHistory');
        error(e);
    }
}

function* changeLastSeenTime(data) {
    const {callback, error, chatId} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.put(`${apiUrl}chat/lastseen?ChatId=${chatId}`,{},{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'changeLastSeenTime');
        error(e);
    }
}

function* getMessages(data) {
    const {callback, error, page, loadMore, disableLoadMore,messageId} = data.payload;
    let chatId = yield select((store) => store.ChatReducer.activeChatId);
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url;

    if(page){
        url = `${apiUrl}messages?ChatId=${chatId}&Page=${page}&PageSize=40`
    }else {
        url = `${apiUrl}messages?ChatId=${chatId}&PageSize=40&MessageId=${messageId}`
    }

    if(chatId){
        try {
            let response = yield HttpClient.get(url,{
                headers: {
                    Authorization: `Bearer ${userAccessTokens.access_token}`,
                    DeviceId: DeviceInfo.deviceId
                }
            });

            if(response.status === 200){
                if(loadMore){
                    if(!response.data.length){
                        disableLoadMore();
                    }
                    else{
                        let listData = yield select((store) => store.ChatReducer.listData);
                        let newArr = listData.concat(response.data);
                        yield put({type: SET_ACTIVE_CHAT_LIST_DATA, payload: newArr});
                    }
                    callback();
                }else{
                    yield put({type: SET_ACTIVE_CHAT_LIST_DATA, payload: response.data});
                    callback();
                }
            }
        } catch (e) {
            console.log(e.toString(), 'getMessages');
            error(e);
        }
    }
}

function* deleteMessage(data) {
    const {callback, error, id} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}message?Id=${id}`;

    try {
        let response = yield HttpClient.delete(url,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            let listData = yield select((store) => store.ChatReducer.listData);
            let index = listData.findIndex(item=>item.id===id)
            if(index>-1){
                listData.splice(index, 1)
                yield put({type: SET_ACTIVE_CHAT_LIST_DATA, payload: listData});
            }
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'deleteMessage');
        error(e);
    }
}

function* refreshChannelsList() {
    yield put({type: SET_SHOW_CHANNELS_LIST, payload: false});
    yield put({type: SET_SHOW_CHANNELS_LIST, payload: true});
}

function* updateUnseenChatsCount(data) {
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens ? userAccessTokens : {};

    try {
        let response = yield HttpClient.post(`${apiUrl}message/callback`, {
                type: "channel.hide",
                user: data.payload
            },
            {
                headers: {
                    Authorization: `Bearer ${userAccessTokens.access_token}`,
                }
            }
        );
        if (response.status === 200) {
            // console.log(1111122222, response)
        }
    } catch (e) {
        console.log(e.toString(), 'updateUnseenChatsCount');
    }
}

export {
    getPrivateChat,
    sendPrivateMessage,
    getChats,
    deleteChatHistory,
    changeLastSeenTime,
    getMessages,
    deleteMessage,
    refreshChannelsList,
    updateUnseenChatsCount
}
