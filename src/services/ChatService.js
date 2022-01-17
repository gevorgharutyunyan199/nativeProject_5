import AsyncStorage from '@react-native-async-storage/async-storage';
import {StreamChat} from "stream-chat";
import {apiUrl, chatKey} from '../assets/constants'
import HttpClient from "./HttpClient";
import {DeviceInfo} from "../assets/DeviceInfo";
import store from "../redux";
import {GET_CONTACTS} from "../actionsTypes";
import ContactsService from "./ContactsService";
import ValidationService from "./ValidationService";
import {Alert} from "react-native";

class _ChatService {
    chatClient = null;
    options = {
        presence: true,
        state: true,
        watch: true,
    };
    sort = {last_message_at: -1};
    filters = {
        members: {}
    };
    currentUser = {};

    async setup(access){
        store.dispatch({type: GET_CONTACTS, payload: {
            callback: async ()=>{
                try {
                    await ContactsService.getPhoneContacts();
                }catch (e){
                    console.log(e)
                }
            },
            error: ()=>{}
        }});
        let chatToken = await AsyncStorage.getItem('chatToken');
        let currentUser = await this.getCurrentUser();
        this.currentUser = currentUser;
        const user = {id: currentUser.id};
        this.filters.members = { $in: [currentUser.id]};
        this.chatClient = StreamChat.getInstance(chatKey);

        if(access || currentUser?.status === "Active"){
            await this.chatClient.disconnect().then(async ()=>{
                await this.chatClient.connectUser(user, JSON.parse(chatToken));
            });
        }
    }

    async getCurrentUser(){
        try {
            const jsonValue = await AsyncStorage.getItem('currentUser');
            return jsonValue != null ? JSON.parse(jsonValue) : {};
        } catch(e) {
            console.log(e)
        }
    };

    async creatChannel(data,cb,error){
        let members = [];
        let validationNumbers = [];

        let userAccessTokens = await AsyncStorage.getItem('userAccessTokens');
        userAccessTokens = JSON.parse(userAccessTokens);
        userAccessTokens = userAccessTokens?userAccessTokens:{};

        data.forEach(i=>{
            members.push({
                "contactId": i.id,
                "phoneNumber": i.number
            });
            validationNumbers.push(i.number)
        });

        let valid = ValidationService.validate(validationNumbers);

        if(valid){
            await HttpClient.post(`${apiUrl}chat`,{
                "members": members
            },{
                headers: {
                    Authorization: `Bearer ${userAccessTokens.access_token}`,
                    DeviceId: DeviceInfo.deviceId
                }
            }).then((res)=>{
                if(cb){
                    cb(res.data);
                }
            }).catch((e)=>{
                error();
                console.log(e,'creatChannel')
            });
        }else {
            if(validationNumbers.length<2){
                Alert.alert(
                    "Unable to Create Conversation",
                    "Selected number is invalid. Please try again."
                );
            }else {
                Alert.alert(
                    "Unable to Add Members to the Group",
                    "Numbers in red are invalid. Please try again."
                );
            }
            error();
        }

    }
}

const ChatService = new _ChatService();

export default ChatService;
