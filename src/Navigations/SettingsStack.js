import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../screens/Settings';

const SettingsStack = createNativeStackNavigator();

function NavigationHistoryStack() {
    return (
        <SettingsStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'Settings'}>
            <SettingsStack.Screen name="Settings" component={Settings} />
        </SettingsStack.Navigator>
    );
}

export default NavigationHistoryStack;
