import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Keypad from '../screens/Keypad';

const KeypadStack = createNativeStackNavigator();

function NavigationKeypadStack() {
    return (
        <KeypadStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'Keypad'}>
            <KeypadStack.Screen name="Keypad" component={Keypad} />
        </KeypadStack.Navigator>
    );
}

export default NavigationKeypadStack;
