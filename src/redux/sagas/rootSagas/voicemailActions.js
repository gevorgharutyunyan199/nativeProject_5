import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from "../../../assets/constants";
import HttpClient from '../../../services/HttpClient';
import {DeviceInfo} from "../../../assets/DeviceInfo";
import {put, select} from "redux-saga/effects";
import {
    MARK_VOICEMAIL_READED,
    SET_VOICEMAILS,
    SET_VOICEMAIL_CONTENT,
    DELETE_VOICEMAIL_IN_LIST
} from '../../../actionsTypes';
import ContactsService from "../../../services/ContactsService";

function* getVoicemails(data) {
    const {callback, error, page, loadMore, disableLoadMore, PhoneNumbers} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}user/voicemails?Page=${page}&PhoneNumbers=${PhoneNumbers?PhoneNumbers.join():''}`;

    try {
        let response = yield HttpClient.get(url,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            for(let i = 0; i < response.data.length; i++){
                response.data[i].contact = ContactsService.getContactByNumber(response.data[i].phoneNumber)
            }

            if(loadMore){
                if(!response.data.length){
                    disableLoadMore();
                }
                else{
                    let callHistory = yield select((store) => store.UserInfoReducer.callHistory);
                    let newArr = callHistory.concat(response.data);
                    yield put({type: SET_VOICEMAILS, payload: newArr});
                }
                callback();
            }else{
                yield put({type: SET_VOICEMAILS, payload: response.data});
                callback();
            }
        }
    } catch (e) {
        console.log(e.toString(), 'getVoicemails');
        error(e);
    }
}


function* getVoicemailById(data) {
    const {callback, error, id, index} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}user/voicemail?Id=${id}`;

    try {
        let response = yield HttpClient.get(url,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            yield put({type: SET_VOICEMAIL_CONTENT, payload: {index: index, value: response.data.content}});
            callback(response.data.content);
        }
    } catch (e) {
        console.log(e.toString(), 'getVoicemailById');
        error(e);
    }
}

function* markVoicemail(data) {
    const {callback, error, id, index} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}user/voicemail/mark`;

    try {
        let response = yield HttpClient.put(url,{
            "Status": true,
            "id": id
        },{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            yield put({type: MARK_VOICEMAIL_READED, payload: {index: index, value: true}});
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'markVoicemail');
        error(e);
    }
}

function* deleteVoicemail(data) {
    const {callback, error, id, index} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}user/voicemail?Id=${id}`;

    try {
        let response = yield HttpClient.delete(url,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            yield put({type: DELETE_VOICEMAIL_IN_LIST, payload: {index: index}});
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'deleteVoicemail');
        error(e);
    }
}

export {
    getVoicemails,
    getVoicemailById,
    markVoicemail,
    deleteVoicemail
}
