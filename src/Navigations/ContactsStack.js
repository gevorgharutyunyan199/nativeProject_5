import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Contacts from '../screens/Contacts';

const ContactsStack = createNativeStackNavigator();

function NavigationContactsStack() {
    return (
        <ContactsStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'Contacts'}>
            <ContactsStack.Screen name="Contacts" component={Contacts} />
        </ContactsStack.Navigator>
    );
}

export default NavigationContactsStack;
