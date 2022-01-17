import {DeviceInfo} from  './DeviceInfo';

if (__DEV__) {
    console.log('Development');
} else {
    console.log('Production');
}

let apiUrl, appInfo, chatKey, instaBugKey, defaultHeaders, defaultParams;
let apiDevUrl = '';
let apiProdUrl = '';

if(DeviceInfo.bundleId === ''){
    apiUrl = apiDevUrl;
    instaBugKey = '';
    chatKey = '';
    appInfo = {
        appId: '',
        apiKey: '',
        environment: 'development'
    };
    defaultHeaders = {};
    defaultParams = {};

}else if(DeviceInfo.bundleId === ''){
    apiUrl = apiProdUrl;
    instaBugKey = '';
    chatKey = '';
    appInfo = {
        appId: '',
        apiKey: '',
        environment: 'production'
    };
    defaultHeaders = {'Ocp-Apim-Subscription-Key': ''};
    defaultParams = {'subscription-key': ''}
}

export {apiUrl,appInfo,apiProdUrl,apiDevUrl,chatKey, instaBugKey, defaultHeaders, defaultParams};
