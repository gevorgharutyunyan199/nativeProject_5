import React, {Component} from 'react';
import {BackHandler, View, TouchableOpacity, Keyboard, AppState} from 'react-native';
import styles from './styles';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import AlertService from '../../services/AlertService';
import NavigationService from "../../services/NavigationService";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {TabScreenHeader} from "../../components";
import {sizes} from "../../assets/sizes";
import {NewChatAndroid} from '../../assets/icons';
import {
    GET_BROADSOFT_STATUSES,
    GET_CURRENT_USER
} from "../../actionsTypes";
import ChatSDK from '../../components/ChatSDK'
import ContactsService from "../../services/ContactsService";

class Messages extends Component {

    state = {
        loaderVisible: false,
        search: '',
        page: 1,
        scrollEnabled: true,
        refreshing: false,
        loadingMore: false,
        loading: false
    };

    async componentDidMount() {
        AppState.addEventListener('change',this._stateChange);
        NavigationService.init(this.props.navigation);
        this.props.makeAction(GET_CURRENT_USER,{
            callback: async ()=>{
                await AlertService.checkSubscriptionExpired();
            },
            error: ()=>{}
        });
        this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
            if(DeviceInfo.android){
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
            }
            NavigationService.init(this.props.navigation);
            this.props.makeAction(GET_CURRENT_USER,{
                callback: async ()=>{
                    await AlertService.checkSubscriptionExpired();
                },
                error: ()=>{}
            });
        });
        this.props.makeAction(GET_BROADSOFT_STATUSES,{
            callback: ()=>{},
            error: ()=>{},
        });
        this.navigationListenerBlur = this.props.navigation.addListener('blur', async () => {
            if(DeviceInfo.android){
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
            }
        });
    }

    componentWillUnmount() {
        AppState.removeEventListener('change',this._stateChange);
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove()
        }
        if(this.navigationListenerBlur && this.navigationListenerBlur.remove){
            this.navigationListenerBlur.remove()
        }
    }

    _stateChange = async (state)=>{
        if(state === 'active'){
            await ContactsService.getPhoneContacts()
        }
    };

    handleBackButton = () => {
        BackHandler.exitApp();
        return true;
    };

    newChat = ()=>{
        if(DeviceInfo.android){
            Keyboard.dismiss();
            setTimeout(()=>{
                this.props.navigation.navigate('Chat', {newChat: true})
            },100)
        }else {
            this.props.navigation.navigate('Chat', {newChat: true})
        }
    };

    render() {
        return (
            <View style={styles.screen}>
                {DeviceInfo.android?<TouchableOpacity onPress={this.newChat} style={styles.androidNewChatButton}>
                    <NewChatAndroid width={sizes.size62} height={sizes.size62} />
                </TouchableOpacity>:null}
                <TabScreenHeader
                    title={'Messages'}
                    rightIcon={DeviceInfo.ios?'chat':null}
                    rightIconPress={DeviceInfo.ios?this.newChat:null}
                />
                <View style={{flex: 1}}>
                    <ChatSDK/>
                </View>
            </View>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(Messages)
