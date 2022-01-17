import React, {Component} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MyTabBar} from "../components";
import MessagesStack from "./MessagesStack";
import ContactsStack from "./ContactsStack";
import KeypadStack from "./KeypadStack";
import HistoryStack from "./HistoryStack";
import SettingsStack from "./SettingsStack";
import {connect} from "react-redux";
import {makeAction} from "../makeAction";
import {GET_BLOCKED_CONTACTS} from "../actionsTypes";

const Tab = createBottomTabNavigator();

class TabNavigation extends Component {

    state = {
        contactsPermissionRequested: false
    };

    async componentDidMount() {
        this.getBlockContacts();
    }

    getBlockContacts = ()=>{
        this.props.makeAction(GET_BLOCKED_CONTACTS,{
            callback: ()=>{},
            error: ()=>{}
        });
    };



    render() {
        const {route} = this.props;
        if(route.params && route.params.clearInputs){
            route.params.clearInputs();
        }

        return (
            <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <MyTabBar {...props}/>} initialRouteName={'MessagesStack'}>
                <Tab.Screen name="MessagesStack" component={MessagesStack} />
                <Tab.Screen name="ContactsStack" component={ContactsStack} />
                <Tab.Screen name="KeypadStack" component={KeypadStack} />
                <Tab.Screen name="HistoryStack" component={HistoryStack} />
                <Tab.Screen name="SettingsStack" component={SettingsStack} />
            </Tab.Navigator>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(TabNavigation)
