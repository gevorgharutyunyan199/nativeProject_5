import store from "../redux";
import ContactsApi from "react-native-contacts";
import HttpClient from "./HttpClient";
import {DeviceInfo} from "../assets/DeviceInfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from "../assets/constants";
import {SET_APP_CONTACTS, REFRESH_CHANNELS_LIST, SET_CONTACTS_SYNCING} from "../actionsTypes";
import ImageResizer from "react-native-image-resizer";
import ValidationService from "./ValidationService";

class _ContactsService {
    syncStarted = false;

    getPhoneContacts = async ()=>{
        await ContactsApi.getAll().then(async (contacts) => {
            let arr = [];
            let appContacts = store.getState().UserInfoReducer.appContacts;
            let deletedContacts = await AsyncStorage.getItem('deletedContacts');
            deletedContacts = deletedContacts?JSON.parse(deletedContacts):[];

            for(let i = 0; i < contacts.length; i++){
                contacts[i].phoneNumbers = this.clearSymbols(contacts[i].phoneNumbers);
                if(appContacts.findIndex(item=>item.recordId ===  contacts[i].recordID) === -1 && deletedContacts.findIndex(item=>item === contacts[i].recordID) === -1){
                    contacts[i] = {
                        "recordId": contacts[i].recordID,
                        "jobTitle": contacts[i].jobTitle,
                        "givenName": contacts[i].givenName,
                        "middleName": contacts[i].middleName,
                        "familyName": contacts[i].familyName,
                        "company": contacts[i].company,
                        "phoneNumbers": contacts[i].phoneNumbers,
                        "imageUri": contacts[i].imageUri?contacts[i].imageUri:'',
                        "thumbnailPath": contacts[i].thumbnailPath,
                        "notes": contacts[i].notes,
                        "emailAddresses": contacts[i].emailAddresses,
                        "imAddresses": contacts[i].imAddresses,
                        "postalAddresses": contacts[i].postalAddresses,
                        "birthday": contacts[i].birthday,
                        "urlAddresses": contacts[i].urlAddresses,
                        "textTone": contacts[i].textTone,
                        "hasThumbnail": contacts[i].hasThumbnail
                    };
                    arr.push(contacts[i]);
                }
            }
            if(arr.length){
                let contactsHasThumbnail = [];
                arr.forEach((i)=>{
                    if(i.hasThumbnail){
                        contactsHasThumbnail.push(i)
                    }
                });
                await AsyncStorage.setItem('contactsHasThumbnail', JSON.stringify(contactsHasThumbnail));
                await this.syncContacts(arr);
            }else {
                await this.startImageSync()
            }
        })
    };

    clearSymbols = (phoneNumbers)=>{
        phoneNumbers.forEach((item)=>{
            let plus = false;
            if(item.number[0] === '+'){
                plus = true
            }
            item.number = item.number.replace(/[^a-zA-Z0-9]/g, '');
            item.number = plus?`+${item.number}`:item.number
        });

        return phoneNumbers
    };

    syncContacts = async (contacts)=>{
        if(this.syncStarted){
            return
        }

        store.dispatch({ type: SET_CONTACTS_SYNCING, payload: true});
        console.log('sync started');

        this.syncStarted = true;
        let userAccessTokens = await AsyncStorage.getItem('userAccessTokens');
        userAccessTokens = JSON.parse(userAccessTokens);
        userAccessTokens = userAccessTokens?userAccessTokens:{};
        await HttpClient.post(`${apiUrl}contacts/sync`,{
            Contacts: contacts
        },{
            headers: {
                Authorization: `Bearer ${userAccessTokens.access_token}`,
                DeviceId: DeviceInfo.deviceId
            }
        }).then(async (res)=>{
            let appContacts = store.getState().UserInfoReducer.appContacts;
            let appContactsNew = JSON.parse(JSON.stringify(appContacts.concat(res.data)));

            appContactsNew = appContactsNew.sort((a,b)=>{
                if(!a.givenName && !a.familyName) {
                    return 1;
                } else if(!b.givenName && !b.familyName) {
                    return -1;
                } else {
                    let strA = `${a.givenName?a.givenName+' ':''}${a.familyName?a.familyName:''}`;
                    let strB = `${b.givenName?b.givenName+' ':''}${b.familyName?b.familyName:''}`;
                    return strA.toLowerCase() < strB.toLowerCase() ? -1 : strA.toLowerCase() > strB.toLowerCase() ? 1 : 0;
                }
            });

            store.dispatch({type: SET_APP_CONTACTS, payload: appContactsNew});
            store.dispatch({type: REFRESH_CHANNELS_LIST, payload: {}});

            let contactsHasThumbnail = await AsyncStorage.getItem('contactsHasThumbnail');
            contactsHasThumbnail = JSON.parse(contactsHasThumbnail);
            for(let i = 0; i < contactsHasThumbnail.length; i++){
                res.data.forEach((item)=>{
                    if(item.recordId === contactsHasThumbnail[i].recordId){
                        contactsHasThumbnail[i].id = item.id;
                    }
                })
            }

            store.dispatch({ type: SET_CONTACTS_SYNCING, payload: false});
            console.log('sync ended');

            await AsyncStorage.setItem('contactsHasThumbnail', JSON.stringify(contactsHasThumbnail), async ()=>{
                await this.startImageSync()
            });
            this.syncStarted = false;
        }).catch(e=>{
            console.log(e,'syncContact');
            this.syncStarted = false;
        });
    };

    startImageSync = async ()=>{
        let contactsHasThumbnail = await AsyncStorage.getItem('contactsHasThumbnail');
        contactsHasThumbnail = JSON.parse(contactsHasThumbnail);
        if(contactsHasThumbnail && contactsHasThumbnail.length){
            for await (let item of contactsHasThumbnail) {
                let userAccessTokens = await AsyncStorage.getItem('userAccessTokens');
                userAccessTokens = JSON.parse(userAccessTokens);
                userAccessTokens = userAccessTokens?userAccessTokens:{};

                let formData = new FormData();
                let resizeFile = await ImageResizer.createResizedImage(
                    item.thumbnailPath,
                    500,
                    500,
                    'JPEG',
                    100,
                    0,
                    undefined,
                    false,
                    {
                        mode: 'contain',
                        onlyScaleDown: true
                    }
                );

                let uri = resizeFile.path;

                formData.append("file", {
                    uri: uri,
                    type: 'image',
                    name: `${new Date().getTime()}`
                });
                formData.append("Content-Type", 'image/jpeg');

                try {
                    await HttpClient.post(`${apiUrl}contacts/image?contactId=${item.id}`, formData,{
                        headers: {
                            Authorization: `Bearer ${userAccessTokens.access_token}`,
                            DeviceId: DeviceInfo.deviceId,
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(async ()=>{
                        await this.deleteItemInStorage(item);
                    });
                } catch (e) {
                    await this.deleteItemInStorage(item);
                    console.log(e.toString(), 'addContactImage');
                }
            }
        }
    };

    deleteItemInStorage = async (item)=>{
        let arr = await AsyncStorage.getItem('contactsHasThumbnail');
        arr = JSON.parse(arr);
        let index = arr.findIndex(i=>i.id === item.id);
        if(index>-1){
            arr.splice(index, 1);
            await AsyncStorage.setItem('contactsHasThumbnail', JSON.stringify(arr));
        }
    };

    getContactByNumber = (number)=>{
        let appContacts = store.getState().UserInfoReducer.appContacts;
        for(let i = 0; i < appContacts.length; i++){
            for(let j = 0; j < appContacts[i].phoneNumbers.length; j++){
                let contactNumber = `${appContacts[i].phoneNumbers[j].number}`;
                if(contactNumber === `${number}` || contactNumber=== `+${number}`
                    || ValidationService.parsePhoneNumber(contactNumber) === ValidationService.parsePhoneNumber(number))
                {
                    return appContacts[i];
                }
            }
        }
        return null
    };

    getContactById = (id)=>{
        let appContacts = store.getState().UserInfoReducer.appContacts;
        for(let i = 0; i < appContacts.length; i++){
            if(appContacts[i].id === id){
                return appContacts[i]
            }
        }
        return null
    };

    getNumberLabel = (number)=>{
        let appContacts = store.getState().UserInfoReducer.appContacts;
        for(let i = 0; i < appContacts.length; i++){
            for(let j = 0; j < appContacts[i].phoneNumbers.length; j++){
                if(`${appContacts[i].phoneNumbers[j].number}` === `${number}`){
                    return appContacts[i].phoneNumbers[j].label;
                }
            }
        }
        return 'Phone'
    };

    deleteAllContacts = async ()=>{
        console.log('start delete');
        let userAccessTokens = await AsyncStorage.getItem('userAccessTokens');
        userAccessTokens = JSON.parse(userAccessTokens);
        userAccessTokens = userAccessTokens?userAccessTokens:{};
        let appContacts = store.getState().UserInfoReducer.appContacts;

        for await (let item of appContacts) {
             try {
                await HttpClient.delete(`${apiUrl}contact?Id=${item.id}`, {
                    headers: {
                        Authorization: `Bearer ${userAccessTokens.access_token}`,
                        DeviceId: DeviceInfo.deviceId,
                        'Content-Type': 'multipart/form-data'
                    }
                })
            } catch (e) {
                console.log(e.toString(), 'deleteAllContacts');
            }
        }
        console.log('All contacts deleted')
    };
}

const ContactsService = new _ContactsService();

export default ContactsService;
