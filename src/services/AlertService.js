import {Alert, Linking} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from "./NavigationService";

class _AlertService {
    navigation = null;
    alertOpened = false;

    async checkSubscriptionExpired(){
        if(!this.alertOpened){
            let currentUser = await AsyncStorage.getItem('currentUser');
            currentUser = JSON.parse(currentUser);
            if(currentUser.status === 'Expired'){
                NavigationService.navigation.navigate('ExpiredSubscription')
            }
        }
    }

    async call(number){
        let phoneNumber = number;
        phoneNumber = `tel:${number}`;
        Linking.canOpenURL(phoneNumber).then(supported => {
            if(!supported){
                Alert.alert('Phone number is not available','');
            }else{
                Linking.openURL(phoneNumber);
            }
        }).catch(err => console.log(err));
    }
}

const AlertService = new _AlertService();

export default AlertService;
