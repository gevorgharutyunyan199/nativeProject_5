import {put,select} from "redux-saga/effects";
import {apiUrl} from "../../../assets/constants";
import {DeviceInfo} from "../../../assets/DeviceInfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignalRClient from '../../../services/SignalRClient';
import NavigationService from '../../../services/NavigationService';
import HttpClient from '../../../services/HttpClient';
import messaging from "@react-native-firebase/messaging";
import NotificationService from "../../../services/NotificationService";
import {checkNotifications} from "react-native-permissions";
import {
    SET_SIGN_UP_AREA_CODES_LIST_DATA,
    SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA,
    SIGN_IN,
    SET_LAST_CALL_COUNT,
    SET_USER_INITIAL_STATE
} from '../../../actionsTypes';

function* getAreaCodesListData(data) {
    const {callback} = data.payload;
    try {
        let response = yield HttpClient.get(`${apiUrl}area/codes`,{
            headers: {
                DeviceId: DeviceInfo.deviceId
            }
        });
        if(response.status === 200){
            yield put({type: SET_SIGN_UP_AREA_CODES_LIST_DATA, payload: response.data});
            callback();
        }
    } catch (e) {
        console.log(e.toString(), 'getAreaCodesListData');
        callback();
    }
}

function* getPhoneNumbersLIstData(data) {
    const {page,callback,loadMore,disableLoadMore,searchText} = data.payload;
    try {
        const selectedAreaCode = yield select((store) => store.SignUpReducer.selectedAreaCode);
        let url = '';
        if(searchText){
            url = `${apiUrl}numbers?AreaCode=${selectedAreaCode}&Page=${page}&Search=${searchText}`
        }else{
            url = `${apiUrl}numbers?AreaCode=${selectedAreaCode}&Page=${page}`
        }
        let response = yield HttpClient.get(url,{
            headers: {
                DeviceId: DeviceInfo.deviceId
            }
        });
        if(response.status === 200){
            if(loadMore){
                if(!response.data.length){
                    disableLoadMore();
                }
                else{
                    let phoneNumbers = yield select((store) => store.SignUpReducer.phoneNumbers);
                    let newArr = phoneNumbers.concat(response.data);
                    yield put({type: SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA, payload: newArr});
                }
                callback();
            }else{
                yield put({type: SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA, payload: response.data});
                callback();
            }
        }
    } catch (e) {
        console.log(e.toString(), 'getPhoneNumbersLIstData');
        callback();
    }
}

function* sendVerificationSMS(data){
    const {callback, error, number} = data.payload;
    let userNP = yield AsyncStorage.getItem('userNP');
    userNP = JSON.parse(userNP);
    userNP = userNP?userNP:{};
    try {
        let response = yield HttpClient.post(`${apiUrl}user/number/verify`,{
            "PhoneNumber": number?number:`${userNP.number}`
        },{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 200){
            callback(response);
        }
    }catch (e){
        console.log(e.toString(), 'sendVerificationSMS');
        error(e);
    }
}

function* signUp(data){
    const {callback, error, code} = data.payload;
    let userNP = yield AsyncStorage.getItem('userNP');
    userNP = JSON.parse(userNP);
    userNP = userNP?userNP:{};
    try {
        let response = yield HttpClient.post(`${apiUrl}user/signup`,{
            "PhoneNumber": `${userNP.number}`,
            "Password": `${userNP.password}`,
            "Token": code
        },{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 200){
            yield put({type: SIGN_IN, payload: {callback: callback, error: error}});
        }
    }catch (e){
        console.log(e.toString(), 'signUp');
        error(e);
    }
}

function* signIn(data){
    const {callback,error} = data.payload;
    let userNP = yield AsyncStorage.getItem('userNP');
    let tokenFCM = yield AsyncStorage.getItem('tokenFCM');
    if(!tokenFCM && NotificationService.enabled){
        tokenFCM = yield messaging().getToken();
    }
    userNP = JSON.parse(userNP);
    userNP = userNP?userNP:{};
    try {
        let response = yield HttpClient.post(`${apiUrl}user/signin`,{
            "PhoneNumber": `${userNP.number}`,
            "Password": `${userNP.password}`
        },{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json',
                'NotificationToken': tokenFCM
            }
        });
        if(response.status === 200){
            yield AsyncStorage.setItem('userAccessTokens', JSON.stringify(response.data));
            callback(response);
        }
    }catch (e){
        console.log(e.toString(), 'signIn');
        error(e);
    }
}

function* checkAreaCode(data){
    const {callback,error,code} = data.payload;
    try {
        let response = yield HttpClient.get(`${apiUrl}area/codes/available?AreaCode=${code}`,{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    }catch (e){
        console.log(e.toString(), 'checkAreaCode');
        error(e);
    }
}

function* checkSmsToken(data){
    const {callback,error,code,number} = data.payload;
    try {
        let response = yield HttpClient.post(`${apiUrl}user/sms/check`,{
            "Token": `${code}`,
            "PhoneNumber": `${number}`
        },{
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    }catch (e){
        console.log(e.toString(), 'checkSmsToken');
        error(e);
    }
}

function* checkSmsTokenChangeNumber(data){
    const {callback,error,code,number} = data.payload;

    try {
        let response = yield HttpClient.post(`${apiUrl}user/check/sms`,{
            "Token": `${code}`,
            "PhoneNumber": `${number}`
        },{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    }catch (e){
        console.log(e.toString(), 'checkSmsTokenChangeNumber');
        error(e);
    }
}

function* resetPassword(data){
    const {callback,error,code,number,password} = data.payload;
    try {
        let response = yield HttpClient.put(`${apiUrl}user/password/reset`,{
            "Password": `${password}`,
            "PhoneNumber": `${number}`,
            "Token": `${code}`
        },{
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    }catch (e){
        console.log(e.toString(), 'resetPassword');
        error(e);
    }
}

function* orderPhoneNumbers(data){
    const {callback,error} = data.payload;
    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    let selectedPhoneNumber = yield AsyncStorage.getItem('selectedPhoneNumber');
    try {
        let response = yield HttpClient.post(`${apiUrl}numbers/order`,{
            "PhoneNumbers": [`${selectedPhoneNumber}`]
        },{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    }catch (e){
        console.log(e.toString(), 'orderPhoneNumbers');
        error(e);
    }
}

function* checkPhoneNumber(data){
    const {callback,error,number} = data.payload;
    let userNP = yield AsyncStorage.getItem('userNP');
    userNP = JSON.parse(userNP);
    userNP = userNP?userNP:{};
    try {
        let response = yield HttpClient.post(`${apiUrl}user/check`,{
            PhoneNumber: number?number:`${userNP.number}`
        },{
            headers: {
                DeviceId: DeviceInfo.deviceId,
                'Content-Type': 'application/json'
            }
        });
        if(response.status === 200){
            callback(response.data);
        }
    }catch (e){
        console.log(e.toString(), 'checkPhoneNumber');
        error(e);
    }
}

function* signOut(data){
    const {callback} = data.payload;
    let navigation = null;
    if(DeviceInfo.ios){
        NotificationService.setApplicationIconBadgeNumber(0);
    }
    if(data.payload){
        navigation = data.payload.navigation;
    }



    let userAccessTokens = yield AsyncStorage.getItem('userAccessTokens');
    userAccessTokens = JSON.parse(userAccessTokens);
    userAccessTokens = userAccessTokens?userAccessTokens:{};

    let currentUser = yield AsyncStorage.getItem('currentUser');
    currentUser = JSON.parse(currentUser);
    currentUser = currentUser?currentUser:{};

    yield checkNotifications().then((res)=>{
        if(res.status === 'granted'){
            messaging().unsubscribeFromTopic(currentUser.id).then(
                ()=>console.log('Unsubscribed fom the topic')
            ).catch(
                (e)=>{
                    console.log(e,'Error unsubscribed fom the topic')
                }
            );
        }
    });

    try {
        let response = yield HttpClient.get(`${apiUrl}user/signout`,{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        });

        if(response.status === 200){
            yield AsyncStorage.clear();
            yield SignalRClient.stop();
            yield put({type: SET_LAST_CALL_COUNT, payload: 0});
            yield put({type: SET_USER_INITIAL_STATE, payload: ''});
            callback();
            if(NavigationService.navigation){
                NavigationService.navigation.navigate('SignInPage',{disableBackSwipe: true})
            }else if(navigation){
                navigation.navigate('SignInPage');
            }
        }
    } catch (e) {
        console.log(e.toString(), 'signout');
    }
}

export {
    getAreaCodesListData,
    getPhoneNumbersLIstData,
    checkAreaCode,
    sendVerificationSMS,
    signUp,
    signIn,
    checkSmsToken,
    resetPassword,
    orderPhoneNumbers,
    signOut,
    checkPhoneNumber,
    checkSmsTokenChangeNumber
}
