import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomePage from './screens/WelcomePage';
import SignInPage from './screens/SignInPage';
import SignUpStep1 from './screens/SignUpStep1';
import SignUpStep2 from './screens/SignUpStep2';
import SubscriptionPage from './screens/SubscriptionPage';
import ExpiredSubscription from './screens/ExpiredSubscription';
import PrivacyPolicy from './screens/PrivacyPolicy';
import SettingUpPhoneNumber from './screens/SettingUpPhoneNumber';
import CreateAccount from './screens/CreateAccount';
import VerifyNumber from './screens/VerifyNumber';
import ForgotPassword from './screens/ForgotPassword';
import ForgotVerification from './screens/ForgotVerification';
import ChooseNewPassword from './screens/ChooseNewPassword';
import VoicemailGreeting from './screens/VoicemailGreeting';
import EditGreeting from './screens/EditGreeting';

import TabNavigation from './Navigations/TabNavigation';
import ContactDetails from "./screens/ContactDetails";
import EditContact from "./screens/EditContact";
import ContactLabel from "./screens/ContactLabel";

import ChangePassword from "./screens/ChangePassword";
import SubscriptionDetails from "./screens/SubscriptionDetails";
import Account from "./screens/Account";
import ChangeRegisteredNumber from "./screens/ChangeRegisteredNumber";
import About from "./screens/About";
import BlockedNumbers from "./screens/BlockedNumbers";
import Gallery from "./screens/Gallery";
import CameraPage from "./screens/CameraPage";
import Chat from "./screens/Chat";
import Contacts from "./screens/Contacts";
import ChannelScreen from "./screens/ChannelScreen";
import AttachmentsMenu from "./screens/AttachmentsMenu";
import ChatInfo from "./screens/ChatInfo";

import {
    OverlayProvider
} from 'stream-chat-react-native';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppContext from './AppContext';
import ChatService from "./services/ChatService";
import ContactsService from "./services/ContactsService";
import ValidationService from "./services/ValidationService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeTheme} from "./helpers"
const MainStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const HeaderCustomCenterElement = (props)=>{
    const [name, setName] = useState('');
    const {photo} = props;

    useEffect(() => {
        if(photo){
            ChatService.chatClient.getMessage(props.photo.messageId).then(async (res)=>{
                let currentUser = await AsyncStorage.getItem('currentUser');
                currentUser = JSON.parse(currentUser);
                let contact = ContactsService.getContactByNumber(res.message?.user.orderedPhoneNumbers?res.message?.user?.orderedPhoneNumbers?.[0]:'');
                let name = '';
                let numberId = res.message?.user?.orderedPhoneNumbers?.[0];
                if(contact){
                    name = contact.givenName || contact.familyName?`${contact.givenName?contact.givenName+' ':''}${contact.familyName?contact.familyName:''}`:`${ValidationService.parsePhoneNumber(numberId)}`;
                }else {
                    name = ValidationService.parsePhoneNumber(numberId)
                }
                if(ValidationService.parsePhoneNumber(numberId) === ValidationService.parsePhoneNumber(currentUser.orderedNumbers[0])){
                    name = 'You';
                }
                setName(name);
            });
        }
    }, [JSON.stringify(props)]);
    return (
        photo?<View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text>{name}</Text>
        </View>:null
    )
};

function MainStackScreen(props) {

    const [channel, setChannel] = useState();
    const [thread, setThread] = useState();
    const {bottom} = useSafeAreaInsets();

    let initialRouteName = null;
    let initialParams = null;
    if(props.route && props.route.params){
        initialRouteName = props.route.params.initialRouteName;
        initialParams = props.route.params.initialParams;
    }

    return (
        <SafeAreaProvider>
            <AppContext.Provider value={{channel, setChannel, setThread, thread}}>
                <OverlayProvider value={{ style: makeTheme(false)}} bottomInset={bottom} imageGalleryCustomComponents={{header: {centerElement: (props)=><HeaderCustomCenterElement {...props}/>}}}>
                    <MainStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName?initialRouteName:'WelcomePage'}>
                        <MainStack.Screen name="WelcomePage" component={WelcomePage} options={{gestureEnabled: false}} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="SignInPage" component={SignInPage} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="SignUpStep1" component={SignUpStep1} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="SignUpStep2" component={SignUpStep2} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="SubscriptionPage" component={SubscriptionPage} options={{gestureEnabled: false}} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="ExpiredSubscription" component={ExpiredSubscription} options={{gestureEnabled: false}} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="SettingUpPhoneNumber" component={SettingUpPhoneNumber} options={{gestureEnabled: false}} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="CreateAccount" component={CreateAccount} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="VerifyNumber" component={VerifyNumber} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="ForgotPassword" component={ForgotPassword} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="ForgotVerification" component={ForgotVerification} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="ChooseNewPassword" component={ChooseNewPassword} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="TabNavigation" component={TabNavigation} options={{gestureEnabled: false}} initialParams={initialParams?initialParams:{}} />
                        <MainStack.Screen name="ContactDetails" component={ContactDetails} />
                        <MainStack.Screen name="EditContact" component={EditContact} />
                        <MainStack.Screen name="ChangePassword" component={ChangePassword} />
                        <MainStack.Screen name="SubscriptionDetails" component={SubscriptionDetails} />
                        <MainStack.Screen name="Account" component={Account} />
                        <MainStack.Screen name="About" component={About} />
                        <MainStack.Screen name="ChangeRegisteredNumber" component={ChangeRegisteredNumber} />
                        <MainStack.Screen name="BlockedNumbers" component={BlockedNumbers} />
                        <MainStack.Screen name="Gallery" component={Gallery} />
                        <MainStack.Screen name="Chat" component={Chat} />
                        <MainStack.Screen name="Contacts" component={Contacts} />
                        <MainStack.Screen name="VoicemailGreeting" component={VoicemailGreeting} />
                        <MainStack.Screen name="EditGreeting" component={EditGreeting} />
                        <MainStack.Screen name="ContactLabel" component={ContactLabel} />
                        <MainStack.Screen name="ChannelScreen" component={ChannelScreen} />
                        <MainStack.Screen name="AttachmentsMenu" component={AttachmentsMenu} />
                        <MainStack.Screen name="ChatInfo" component={ChatInfo} />
                    </MainStack.Navigator>
                </OverlayProvider>
            </AppContext.Provider>
        </SafeAreaProvider>
    );
}

function RootStackScreen(props) {
    return (
        <NavigationContainer>
            <RootStack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
                <RootStack.Screen
                    name="Main"
                    component={MainStackScreen}
                    options={{headerShown: false}}
                    initialParams={props}
                />
                <RootStack.Screen name="CameraPage" component={CameraPage} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default RootStackScreen;
