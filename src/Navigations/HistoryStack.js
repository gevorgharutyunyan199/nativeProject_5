import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import History from '../screens/History';

const HistoryStack = createNativeStackNavigator();

function NavigationHistoryStack() {
    return (
        <HistoryStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'History'}>
            <HistoryStack.Screen name="History" component={History} />
        </HistoryStack.Navigator>
    );
}

export default NavigationHistoryStack;
