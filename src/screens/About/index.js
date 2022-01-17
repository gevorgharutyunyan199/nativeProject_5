import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Linking, AppState} from 'react-native';
import styles from './styles';
import {ScreenLoader, TabScreenHeader} from "../../components";
import {iconsColors} from "../../assets/RootStyles";
import {ArrowRight} from '../../assets/icons';
import {sizes} from "../../assets/sizes";
import {check, PERMISSIONS, checkNotifications} from 'react-native-permissions';
import {DeviceInfo} from "../../assets/DeviceInfo";
import NotificationService from '../../services/NotificationService';

class About extends Component {

    state = {
        loaderVisible: false,
        cameraAccess: 'Disabled',
        photoAccess: 'Disabled',
        microphoneAccess: 'Not Specified',
        notificationsAccess: 'Enabled',
        contactsAccess: 'Enabled',
    };

    async componentDidMount() {
        AppState.addEventListener('change',this._stateChange);

        let contact = '';
        let camera = '';
        let photo = '';
        let microphone = '';
        let notification = '';

        await check(DeviceInfo.ios?PERMISSIONS.IOS.CONTACTS:PERMISSIONS.ANDROID.READ_CONTACTS).then((res)=>{
            switch (res) {
                case 'unavailable':
                    contact = 'Not Specified';
                    break;
                case 'denied':
                    contact = DeviceInfo.android?'Disabled':'Not Specified';
                    break;
                case 'blocked':
                    contact = 'Disabled';
                    break;
                case 'granted':
                    contact = 'Enabled';
                    break;
                default:
                    contact = 'Not Specified'
            }
        });
        await check(DeviceInfo.ios?PERMISSIONS.IOS.CAMERA:PERMISSIONS.ANDROID.CAMERA).then((res)=>{
            console.log(res,'camera');
            switch (res) {
                case 'unavailable':
                    camera = 'Not Specified';
                    break;
                case 'denied':
                    camera = DeviceInfo.android?'Disabled':'Not Specified';
                    break;
                case 'blocked':
                    camera = 'Disabled';
                    break;
                case 'granted':
                    camera = 'Enabled';
                    break;
                default:
                    camera = 'Not Specified'
            }
        });
        await check(DeviceInfo.ios?PERMISSIONS.IOS.PHOTO_LIBRARY:PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((res)=>{
            switch (res) {
                case 'unavailable':
                    photo = 'Not Specified';
                    break;
                case 'denied':
                    photo = DeviceInfo.android?'Disabled':'Not Specified';
                    break;
                case 'limited':
                    photo = 'Enabled';
                    break;
                case 'blocked':
                    photo = 'Disabled';
                    break;
                case 'granted':
                    photo = 'Enabled';
                    break;
                default:
                    photo = 'Not Specified'
            }
        });
        await check(DeviceInfo.ios?PERMISSIONS.IOS.MICROPHONE:PERMISSIONS.ANDROID.RECORD_AUDIO).then((res)=>{
            switch (res) {
                case 'unavailable':
                    microphone = 'Not Specified';
                    break;
                case 'denied':
                    microphone = DeviceInfo.android?'Disabled':'Not Specified';
                    break;
                case 'blocked':
                    microphone = 'Disabled';
                    break;
                case 'granted':
                    microphone = 'Enabled';
                    break;
                default:
                    microphone = 'Not Specified'
            }
        });
        await checkNotifications().then((res)=>{
            if(res.status === 'granted'){
                notification = 'Enabled';
            }else {
                notification = 'Disabled';
            }
        });

        this.setState({
            contactsAccess: contact,
            cameraAccess: camera,
            photoAccess: photo,
            microphoneAccess: microphone,
            notificationsAccess: notification
        })
    }

    componentWillUnmount() {
        AppState.removeEventListener('change',this._stateChange)
    }

    _stateChange = async (state)=>{
        if(state === 'active'){
            let notification = '';
            await checkNotifications().then(async (res)=>{
                if(res.status === 'granted'){
                    notification = 'Enabled';
                    if(this.state.notificationsAccess === 'Disabled'){
                        await NotificationService.setup()
                    }
                }else {
                    notification = 'Disabled';
                }
                this.setState({
                    notificationsAccess: notification
                })
            });
        }
    };

    render() {
        const {navigation} = this.props;
        const {loaderVisible, cameraAccess, photoAccess, microphoneAccess, notificationsAccess, contactsAccess} = this.state;

        return (
            <View style={styles.screen}>
                {loaderVisible?<ScreenLoader/>:null}
                <View style={styles.headerContainer}>
                    <TabScreenHeader
                        title={'About'}
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                    />
                </View>
                <View style={styles.itemsContainer}>
                    <TouchableOpacity style={styles.itemContentContainer} onPress={()=>{navigation.navigate('PrivacyPolicy',{type: 'privacy'})}}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Privacy Policy</Text>
                        </View>
                        <View style={styles.arrowIconContainer}>
                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemContentContainer} onPress={()=>{navigation.navigate('PrivacyPolicy',{type: 'terms'})}}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Terms of Use</Text>
                        </View>
                        <View style={styles.arrowIconContainer}>
                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomBlockContainer}>
                    <View style={styles.itemContentContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Camera Access:</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Text style={[styles[`${cameraAccess}`], styles.rightText]}>{cameraAccess}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContentContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Photo Access:</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Text style={[styles[`${photoAccess}`], styles.rightText]}>{photoAccess}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContentContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Microphone Access:</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Text style={[styles[`${microphoneAccess}`], styles.rightText]}>{microphoneAccess}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContentContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Notifications Access:</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Text style={[styles[`${notificationsAccess}`], styles.rightText]}>{notificationsAccess}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContentContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Contacts Access:</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Text style={[styles[`${contactsAccess}`], styles.rightText]}>{contactsAccess}</Text>
                        </View>
                    </View>
                    <View style={styles.settingsButtonContainer}>
                        <Text style={styles.grayText}>Go to your device <Text
                            style={styles.link}
                            onPress={()=>{DeviceInfo.ios?Linking.openURL('app-settings://'):Linking.openSettings()}}
                        >Settings</Text> to change the app</Text>
                        <Text style={styles.grayText}>permissions.</Text>
                    </View>
                </View>
                <View style={styles.versionTextContainer}>
                    <Text style={styles.versionText}>Version {DeviceInfo.appVersion}</Text>
                </View>
            </View>
        );
    }
}

export default About
