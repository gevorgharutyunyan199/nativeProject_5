import HttpClient from '../../../services/HttpClient';
import {apiProdUrl, apiUrl} from "../../../assets/constants";
import {DeviceInfo} from "../../../assets/DeviceInfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignalRClient from '../../../services/SignalRClient';
import {put} from "redux-saga/effects";
import NotificationService from "../../../services/NotificationService";
import ImageResizer from 'react-native-image-resizer';
import NavigationService from "../../../services/NavigationService";
import {
    SET_UNREAD_MESSAGES_COUNT,
    SET_UNREAD_HISTORY_COUNT,
    SET_VOICEMAIL_GREATINGS,
    SET_UNREAD_VOICEMAIL_COUNT,
    SET_LAST_CALL_COUNT,
    SET_USER_INITIAL_STATE, SET_CURRENT_USER
} from '../../../actionsTypes';
import RNFS from "react-native-fs";

function* getCurrentUser(data) {
    const {callback, error} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.get(`${apiUrl}user`,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            const {unseenChatsCount, unreadVoicemailsCount, unseenMissedCallsCount} = response.data.badgeInfo
            NotificationService.setApplicationIconBadgeNumber(+unseenChatsCount + +unreadVoicemailsCount + +unseenMissedCallsCount)
            yield put({type: SET_UNREAD_MESSAGES_COUNT, payload: unseenChatsCount});
            yield put({type: SET_UNREAD_HISTORY_COUNT, payload: +unreadVoicemailsCount + +unseenMissedCallsCount});
            yield put({type: SET_UNREAD_VOICEMAIL_COUNT, payload: unreadVoicemailsCount});
            yield put({type: SET_CURRENT_USER, payload: response.data});
            HttpClient.get(`${apiUrl}chat/token`,{
                headers: {
                    Authorization: `Bearer ${userAccessTokens.access_token}`,
                    DeviceId: DeviceInfo.deviceId
                }
            }).then((chatToken)=>{
                HttpClient.get(`${apiUrl}negotiate`,{
                    headers: {
                        DeviceId: DeviceInfo.deviceId,
                        UserId: response.data.id
                    }
                }).then(async (responseSignalR)=>{
                    await AsyncStorage.setItem('signalRData', JSON.stringify(responseSignalR.data));
                    await AsyncStorage.setItem('chatToken', JSON.stringify(chatToken.data));
                    await SignalRClient.init();
                    await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));
                    callback();
                }).catch(async (e)=>{
                    await AsyncStorage.setItem('currentUser', JSON.stringify(response.data));
                    callback();
                });
            });
        }
    } catch (e) {
        console.log(e.toString(), 'getCurrentUser');
        error(e);
    }
}

function* refreshSignalRToken() {
    try {
        let currentUser = yield AsyncStorage.getItem('currentUser');

        if(currentUser){
            currentUser = JSON.parse(currentUser)
        }

        HttpClient.get(`${apiUrl}negotiate`,{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                UserId: currentUser.id
            }
        }).then(async (responseSignalR)=>{
            await AsyncStorage.setItem('signalRData', JSON.stringify(responseSignalR.data));
            await SignalRClient.init();
        });
    }catch (e) {
        console.log(e.toString(), 'refreshSignalRToken');
    }
}

function* refreshToken(data) {
    const {callback, error} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.post(`${apiUrl}user/refresh/token`,{
            "RefreshToken": userAccessTokens.refresh_token
        },{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 200){
            yield AsyncStorage.setItem('userAccessTokens', JSON.stringify(response.data));
            callback();
        }
    } catch (e) {
        if(error){
            error(e);
        }
        console.log(e.toString(), 'refreshToken');
    }
}

function* addFile(data) {
    const {callback, error, file, type} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let formData = new FormData();

    if(file.type.indexOf('image')>-1){
        let resizeFile = yield ImageResizer.createResizedImage(
            file.uri,
            3000,
            3000,
            'JPEG',
            30,
            0,
            undefined,
            false,
            {
                mode: 'contain',
                onlyScaleDown: true
            });

        file.uri = resizeFile.path;
    }

    const arr = file.path3gp?.split('/') || []
    let fileName = arr[arr.length - 1]

    if (DeviceInfo.ios && !fileName) {
        switch (file.extension) {
            case 'com.apple.quicktime-movie':
                fileName = 'name.mov'
                break;
            case "public.mpeg-4":
                fileName = 'name.mp4'
                break;
            default:
                break;
        }
    }

    formData.append("file", {
        fileName: fileName || file.uri,
        uri: file.path3gp || file.uri,
        type: file.type.indexOf('video')>-1?'video/quicktime':file.type.indexOf('image')>-1?'image':file.type,
        name: file.fileName?file.fileName:`${new Date().getTime()}`
    });

    formData.append("fileName", fileName || file.uri);
    formData.append("uri", file.path3gp || file.uri);
    formData.append("type", file.type.indexOf('video')>-1?'video/quicktime':file.type.indexOf('image')>-1?'image':file.type );
    formData.append("name", file.fileName?file.fileName:`${new Date().getTime()}`);
    formData.append("Content-Type", file.type.indexOf('video')>-1?'video/mp4':'image/jpeg');

    try {
        let response = yield HttpClient.post(`${apiUrl}file?type=${type}`, formData,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });

        if(response.status === 200){
            if(file.path3gp){
                RNFS.unlink(file.path3gp).then(() => {console.log('3gp deleted')}).catch((err) => {
                    console.log("3gp delete", err.message);
                })
            }
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'addFile');
        error(e);
    }
}

function* changePassword(data) {
    const {callback, error, password, currentPassword} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};


    try {
        let response = yield HttpClient.put(`${apiUrl}user/password`, {
            "OldPassword": currentPassword,
            "NewPassword": password
        },{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'changePassword');
        error(e);
    }
}

function* getBroadsoftStatuses(data) {
    const {callback, error} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.get(`${apiUrl}user/statuses`, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
            }
        });
        if(response.status === 200){
            yield AsyncStorage.setItem('broadsoftStatuses', JSON.stringify(response.data));
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'getBroadsoftStatuses');
        error(e);
    }
}

function* getBadges() {
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let currentUser = yield AsyncStorage.getItem('currentUser');
    currentUser = JSON.parse(currentUser);
    currentUser = currentUser?currentUser:{};

    try {
        let response = yield HttpClient.get(`${apiUrl}badges?UserId=${currentUser.id}`, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
            }
        });

        if(response.status === 200){
            yield put({type: SET_UNREAD_MESSAGES_COUNT, payload: response.data.unseenChatsCount});
            yield put({type: SET_UNREAD_HISTORY_COUNT, payload: +response.data.unreadVoicemailsCount + +response.data.unseenMissedCallsCount});
            yield put({type: SET_UNREAD_VOICEMAIL_COUNT, payload: response.data.unreadVoicemailsCount});
            if(DeviceInfo.ios){
                NotificationService.setApplicationIconBadgeNumber(response.data.unseenChatsCount + response.data.unreadVoicemailsCount + response.data.unseenMissedCallsCount)
            }
        }
    } catch (e) {
        console.log(e.toString(), 'getBadges');
    }
}

function* changeBroadsoftStatuses(data) {
    const {callback, error, type, value} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = '';
    if(type === 'blockCallerId'){
        url = `${apiUrl}user/callerId`
    }else {
        url = `${apiUrl}user/donotdisturb`
    }

    try {
        let response = yield HttpClient.put(url, {
            "Status": value
        },{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'changeBroadsoftStatuses');
        error(e);
    }
}

function* addVoicemailGreeting(data) {
    const {callback, error, uri, name} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let formData = new FormData();

    formData.append("file", {
        uri: uri,
        name: name?name:`${new Date().getTime()}`
    });

    formData.append("Name", name);

    try {
        let response = yield HttpClient.post(`${apiUrl}audiofile`, formData,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });

        if(response.status === 200){
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'addVoicemailGreeting');
        error(e);
    }
}

function* getVoicemailGreetings(data) {
    const {callback, error} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.get(`${apiUrl}audiofiles`, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });

        if(response.status === 200){
            response.data.unshift(response.data[response.data.length-1]);
            response.data.pop();
            yield put({type: SET_VOICEMAIL_GREATINGS, payload: response.data});
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'getVoicemailGreetings');
        error(e);
    }
}

function* getAudioFileByName(data) {
    const {callback, error, name} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.get(`${apiUrl}audiofile?name=${name}`, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            callback(response.data.base64);
        }
    } catch (e) {
        console.log(e.toString(), 'getAudioFileByName');
        error(e);
    }
}

function* enableVoicemailGreeting(data) {
    const {callback, error, name} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.put(`${apiUrl}voicemailgreeting?Name=${name}`, {},{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });

        if(response.status === 200){
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'enableVoicemailGreeting');
        error(e);
    }
}

function* deleteVoicemailGreeting(data) {
    const {callback, error, name, isEnabled} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.delete(`${apiUrl}audiofile?Name=${name}&IsEnabled=${isEnabled?1:0}`, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });

        if(response.status === 200){
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'deleteVoicemailGreeting');
        error(e);
    }
}

function* updateVoicemailGreeting(data) {
    const {callback, error, name, newName} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.put(`${apiUrl}audiofile?Name=${name}&NewName=${newName}`, {},{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });

        if(response.status === 200){
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'updateVoicemailGreeting');
        error(e);
    }
}

function* deleteAccount(data) {
    const {callback, error} = data.payload;

    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let currentUser = yield AsyncStorage.getItem('currentUser');
    currentUser = JSON.parse(currentUser);
    currentUser = currentUser?currentUser:{};

    try {
        let response = yield HttpClient.delete(`${apiUrl}user?PhoneNumber=${currentUser.phoneNumber.replace('+','')}`, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'multipart/form-data'
            }
        });

        if(response.status === 200){
            callback();
            yield AsyncStorage.clear();
            yield SignalRClient.stop();
            yield put({type: SET_LAST_CALL_COUNT, payload: 0});
            yield put({type: SET_USER_INITIAL_STATE, payload: ''});
            NavigationService.navigation.navigate('SignInPage',{disableBackSwipe: true})
        }
    } catch (e) {
        console.log(e.toString(), 'deleteAccount');
        error(e);
    }
}

function* changeRegisteredNumber(data) {
    const {callback, error, number} = data.payload;

    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.put(`${apiUrl}numbers/change?PhoneNumber=${number.replace('+','')}`, {},{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'changeRegisteredNumber');
        error(e);
    }
}

function* setFCM(data) {
    const {tokenFCM} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.post(`${apiUrl}user/notifications`, {}, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                'NotificationToken': tokenFCM,
            }
        });
        if (response.status === 200) {
            // yield AsyncStorage.setItem('userAccessTokens', JSON.stringify(response.data));
            // callback(response);
        }
    } catch (e) {
        console.log(e.toString(), 'setFCM');
    }
}

export {
    getCurrentUser,
    refreshToken,
    addFile,
    changePassword,
    getBroadsoftStatuses,
    changeBroadsoftStatuses,
    getBadges,
    addVoicemailGreeting,
    getVoicemailGreetings,
    enableVoicemailGreeting,
    deleteVoicemailGreeting,
    updateVoicemailGreeting,
    refreshSignalRToken,
    getAudioFileByName,
    deleteAccount,
    changeRegisteredNumber,
    setFCM
}
