import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Messages from '../screens/Messages';

const MessagesStack = createNativeStackNavigator();

function NavigationMessagesStack() {
    return (
        <MessagesStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'Messages'}>
            <MessagesStack.Screen name="Messages" component={Messages} />
        </MessagesStack.Navigator>
    );
}

export default NavigationMessagesStack;
