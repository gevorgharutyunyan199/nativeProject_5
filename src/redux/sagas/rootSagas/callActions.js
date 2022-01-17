import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from "../../../assets/constants";
import HttpClient from '../../../services/HttpClient';
import {DeviceInfo} from "../../../assets/DeviceInfo";
import {put, select} from "redux-saga/effects";
import {Alert} from "react-native";
import {
    GET_BADGES,
    SET_CALL_HISTORY, SET_SEEN_CALLS_REQ
} from '../../../actionsTypes';
import ContactsService from "../../../services/ContactsService";

function* getCallHistory(data) {
    const {callback, error, page, loadMore, disableLoadMore, PhoneNumbers} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}user/calllogs?Page=${page}&PhoneNumbers=${PhoneNumbers?PhoneNumbers.join():''}`;

    try {
        let response = yield HttpClient.get(url,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            const MissedCallLogsIds = []
            for(let i = 0; i < response.data.length; i++){
                if(response.data[i].countryCode){
                    response.data[i].contact = ContactsService.getContactByNumber(`+${response.data[i].countryCode}${response.data[i].phoneNumber}`)
                }
                if(!response.data[i].contact){
                    response.data[i].contact = ContactsService.getContactByNumber(response.data[i].phoneNumber)
                }
                if(!response.data[i].seen){
                    MissedCallLogsIds.push(response.data[i].callLogId)
                }
            }

            if(loadMore){
                if(!response.data.length){
                    disableLoadMore();
                }
                else{
                    let callHistory = yield select((store) => store.UserInfoReducer.callHistory);
                    let newArr = callHistory.concat(response.data);
                    yield put({type: SET_CALL_HISTORY, payload: newArr});
                }
                callback(response.data);
            }else{
                yield put({type: SET_CALL_HISTORY, payload: response.data});
                callback(response.data);
            }

            yield put({type: SET_SEEN_CALLS_REQ, payload: {MissedCallLogsIds}});
        }
    } catch (e) {
        console.log(e.toString(), 'getCallHistory');
        error(e);
    }
}

function* generateOutgoingCallNumber(data) {
    const {callback, error, number} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let callNumber = '';
    let reg = /^\d+$/;

    for (let i = 0; i < number.length; i++) {
        if(number[i] === '+' || number[i] === '*' || number[i] === '#'){
            callNumber = `${callNumber}${number[i]}`
        }else if(reg.test(number[i])){
            callNumber = `${callNumber}${number[i]}`
        }
    }

    try {
        let response = yield HttpClient.post(`${apiUrl}user/imrn`,{
            "PhoneNumber": callNumber
        },{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    } catch (e) {
        if(e.response && e.response.data.errorCode === 'UMIMRN3'){
            Alert.alert(e.response.data.errorMessage,'');
        }else {
            Alert.alert('Invalid phone number','');
        }
        console.log(e.toString(), 'generateOutgoingCallNumber');
        error(e);
    }
}

function* setSeenCalls(data) {
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.post(`${apiUrl}user/seenmissedcalls`, data.payload, {
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });
        if (response.status === 200) {
            yield put({type: GET_BADGES, payload: {}});
        }
    } catch (e) {
        console.log(e.toString(), 'setFCM');
    }
}

export {
    getCallHistory,
    generateOutgoingCallNumber,
    setSeenCalls
}
