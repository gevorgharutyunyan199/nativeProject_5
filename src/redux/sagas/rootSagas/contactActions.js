import HttpClient from '../../../services/HttpClient';
import {apiUrl} from "../../../assets/constants";
import {DeviceInfo} from "../../../assets/DeviceInfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {put,select} from "redux-saga/effects";
import ContactsService from "../../../services/ContactsService";
import {
    REFRESH_CHANNELS_LIST,
    SET_APP_CONTACTS,
    SET_BLOCKED_CONTACTS, SET_BLOCKED_NUMBERS
} from '../../../actionsTypes';

function* createContact(data) {
    const {callback, error, contact} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};
    let appContacts = yield select((store) => store.UserInfoReducer.appContacts);

    try {
        let response = yield HttpClient.post(`${apiUrl}contact`,contact,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 200){
            appContacts.push(response.data);
            appContacts = appContacts.sort();
            yield put({type: SET_APP_CONTACTS, payload: appContacts});
            yield put({type: REFRESH_CHANNELS_LIST, payload: {}});
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'createContact');
        error(e);
    }
}

function* getSuggestionsContacts(data) {
    const {callback, error, searchText} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let url = `${apiUrl}contact/suggestions?Page=&Search=${searchText}`;
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
        console.log(e.toString(), 'getSuggestionsContacts');
        error(e);
    }
}

function* getContacts(data) {
    const {callback, error} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    try {
        let response = yield HttpClient.get(`${apiUrl}contacts`,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });
        if(response.status === 200){
            yield put({type: SET_APP_CONTACTS, payload: response.data});
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'getContacts');
        error(e);
    }
}

function* getContactById(data) {
    const {callback, error, id} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let uri = `${apiUrl}contact?Id=${encodeURIComponent(id)}`;
    try {
        let response = yield HttpClient.get(uri,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'getContactById');
        error(e);
    }
}

function* updateContact(data) {
    const {callback, error, contact} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};
    let appContacts = yield select((store) => store.UserInfoReducer.appContacts);

    let uri = `${apiUrl}contact`;
    try {
        let response = yield HttpClient.put(uri,contact,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 200){
            let index = appContacts.findIndex(i=>i.id === response.data.id);
            appContacts[index] = response.data;
            yield put({type: SET_APP_CONTACTS, payload: appContacts});
            yield put({type: REFRESH_CHANNELS_LIST, payload: {}});
            callback(response.data);
        }
    } catch (e) {
        console.log(e.toString(), 'updateContact');
        error(e);
    }
}

function* deleteContact(data) {
    const {callback, error, contact} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};
    let appContacts = yield select((store) => store.UserInfoReducer.appContacts);

    let uri = `${apiUrl}contact?Id=${contact.id}`;
    try {
        let response = yield HttpClient.delete(uri,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 200){
            if(contact.recordId){
                let deletedContacts = yield AsyncStorage.getItem('deletedContacts');
                if(deletedContacts){
                    deletedContacts = JSON.parse(deletedContacts);
                }else {
                    deletedContacts = [];
                }
                deletedContacts.push(contact.recordId);
                yield AsyncStorage.setItem('deletedContacts',JSON.stringify(deletedContacts));
            }
            let index = appContacts.findIndex(i=>i.id === contact.id);
            appContacts.splice(index,1);
            yield put({type: SET_APP_CONTACTS, payload: appContacts});
            yield put({type: REFRESH_CHANNELS_LIST, payload: {}});
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'deleteContact');
        error(e);
    }
}

function* getBlockedContacts(data) {
    const {callback, error} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};
    let numbersArray = [];

    try {
        let response = yield HttpClient.get(`${apiUrl}user/blockednumbers`,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });
        yield put({type: SET_BLOCKED_NUMBERS, payload: response.data });

        response.data.forEach((item)=>{
           if(!ContactsService.getContactByNumber(item.callsFrom)){
               numbersArray.push(item)
           }
        });

        let responseContacts = yield HttpClient.get(`${apiUrl}contacts/blocked`,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            yield put({type: SET_BLOCKED_CONTACTS, payload: [...numbersArray,...responseContacts.data]});
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'getBlockedContacts');
        error(e);
    }
}

function* blockNumber(data) {
    const {callback, error, num, contactId} = data.payload;
    let number = num;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};
    let numbersArr = [];
    let body = {};

    if(number){
        if(typeof number === 'string'){
            number = number.replace('+1','');
            numbersArr.push(number)
        }else {
            number.forEach((item)=>{
                number = number.replace('+1','');
                numbersArr.push(item.number)
            })
        }
        body.PhoneNumbers = numbersArr
    }

    if(contactId){
        body.ContactId = contactId
    }

    try {
        let response = yield HttpClient.post(`${apiUrl}user/blockednumber`,body,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'blockNumber');
        error(e);
    }
}

function* unblockNumber(data) {
    const {callback, error, number, contactId} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};
    let numbersArr = [];
    let body = {};

    if(number){
        if(typeof number === 'string'){
            numbersArr.push(number)
        }else {
            number.forEach((item)=>{
                numbersArr.push(item.number)
            })
        }
        body.PhoneNumbers = numbersArr
    }

    if(contactId){
        body.ContactId = contactId
    }

    try {
        let response = yield HttpClient.post(`${apiUrl}user/blockednumber/remove`,body,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'unblockNumber');
        error(e);
    }
}

export {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
    getBlockedContacts,
    blockNumber,
    unblockNumber,
    getSuggestionsContacts
}
