import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Switch, Alert, ScrollView} from 'react-native';
import styles from './styles';
import {TabScreenHeader,ScreenLoader} from "../../components";
import {Colors, iconsColors} from "../../assets/RootStyles";
import {ArrowRight} from '../../assets/icons';
import {sizes} from "../../assets/sizes";
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeviceInfo} from "../../assets/DeviceInfo";
import Instabug, {Replies, BugReporting} from 'instabug-reactnative';
import {
    CHANGE_BROADSOFT_STATUSES, DELETE_ACCOUNT,
    SIGN_OUT
} from '../../actionsTypes';
import ValidationService from "../../services/ValidationService";

class Settings extends Component {

    state = {
        doNotDisturb: true,
        olddoNotDisturb: true,
        blockCallerId: false,
        oldblockCallerId: false,
        currentUser: null,
        loaderVisible: false,
        supportRepliesCount: ''
    };

    async componentDidMount() {
        Replies.setOnNewReplyReceivedCallback(()=>{
            this.setSupportReplies()
        });
        BugReporting.onSDKDismissedHandler(()=>{
            this.setSupportReplies()
        });
        this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
            let currentUser = await AsyncStorage.getItem('currentUser');
            if(currentUser){
                currentUser = JSON.parse(currentUser);
                this.setState({
                    currentUser: currentUser
                })
            }
        });

        let broadsoftStatuses = await AsyncStorage.getItem('broadsoftStatuses');
        let currentUser = await AsyncStorage.getItem('currentUser');
        if(currentUser){
            currentUser = JSON.parse(currentUser);
            this.setState({
                currentUser: currentUser
            })
        }
        if(broadsoftStatuses){
            broadsoftStatuses = JSON.parse(broadsoftStatuses);
            this.setState({
                doNotDisturb: broadsoftStatuses.doNotDisturb,
                olddoNotDisturb: broadsoftStatuses.doNotDisturb,
                blockCallerId: broadsoftStatuses.blockCallerId,
                oldblockCallerId: broadsoftStatuses.blockCallerId,
            })
        }
    }

    componentWillUnmount() {
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove()
        }
    }

    setSupportReplies = ()=>{
        try {
            Replies.getUnreadRepliesCount(res=>{
                this.setState(
                    {
                        supportRepliesCount: res?`(${res})`:''
                    }
                )
            });
        }catch (e) {
            console.log(e,'setSupportReplies')
        }
    };

    openDeleteModal = ()=>{
        Alert.alert(
            "Are you sure you want to delete your account?",
            "Please note that all your account data will be deleted permanently and your \nLineX number will get unassigned from your account.",
            [
                {text: 'Not Now', onPress: () => {}},
                {text: 'Delete', style: 'destructive',onPress: async () => {
                        this.setState({
                            loaderVisible: true
                        });
                        this.props.makeAction(DELETE_ACCOUNT,{
                            callback: ()=>{
                                try {
                                    this.setState({
                                        loaderVisible: false
                                    });
                                }catch (e) {
                                    console.log(e)
                                }
                            },
                            error: ()=>{
                                this.setState({
                                    loaderVisible: false
                                });
                            },
                        })
                    }}
            ]
        );
    };

    signOut = ()=>{
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out \nof the app?",
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Sign Out', onPress: this.signOutConfirm }
            ]
        );
    };
    signOutConfirm =()=>{

        this.setState({
            loaderVisible: true
        });
        this.props.makeAction(SIGN_OUT, { callback: ()=>{
            this.setState({
                loaderVisible: false
            })
        }})
    }

    changeBroadsoftStatuses = (key)=>{
        this.setState({
            [key]: !this.state[key]
        },()=>{
            if(this.timeout){
                clearTimeout(this.timeout)
            }
            this.timeout = setTimeout(()=>{
                this.props.makeAction(CHANGE_BROADSOFT_STATUSES, {
                    callback: ()=>{
                        this.setState({
                            [`old${key}`]: this.state[key]
                        })
                    },
                    error: ()=>{
                        this.setState({
                            [key]: [`old${key}`]
                        })
                    },
                    type: key,
                    value: this.state[key]
                })
            },1000)
        })
    };

    render() {
        const {doNotDisturb, blockCallerId, currentUser, loaderVisible, supportRepliesCount} = this.state;
        const {navigation} = this.props;

        return (
            <View style={styles.screen}>
                {loaderVisible?<ScreenLoader tabScreen={true}/>:null}
                <View style={styles.headerContainer}>
                    <TabScreenHeader
                        title={'Settings'}
                    />
                </View>
                <ScrollView>
                    {currentUser?<View style={styles.itemBackground}>
                        <View style={styles.settingItemContainer}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>LineX Number:</Text>
                            </View>
                            <View style={[styles.arrowIconContainer,styles.centreAlignContainer]}>
                                <Text style={styles.phoneNumber}>{currentUser && currentUser.orderedNumbers?ValidationService.parsePhoneNumber(currentUser.orderedNumbers[0]):''}</Text>
                            </View>
                        </View>
                    </View>:null}
                    {currentUser?<View style={[styles.itemBackground,styles.itemMarginBottom]}>
                        <View style={styles.settingItemContainer}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Registered Number:</Text>
                            </View>
                            <View style={[styles.arrowIconContainer,styles.centreAlignContainer]}>
                                <Text style={styles.phoneNumber}>{currentUser?ValidationService.parsePhoneNumber(currentUser.phoneNumber):''}</Text>
                            </View>
                        </View>
                    </View>:null}
                    <View style={styles.itemBackground}>
                        <View style={styles.settingItemContainer}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Do Not Disturb</Text>
                            </View>
                            <Switch
                                style={DeviceInfo.android?{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }:null}
                                trackColor={DeviceInfo.ios?{ false: Colors.white, true: Colors.green }:{ false: Colors.inputBottomBorder, true: Colors.appColorOpacity }}
                                thumbColor={doNotDisturb ? DeviceInfo.ios?Colors.white:iconsColors.appColor : DeviceInfo.ios?Colors.white:Colors.androidSwitcherGray}
                                ios_backgroundColor={Colors.white}
                                onValueChange={()=>{
                                    this.changeBroadsoftStatuses('doNotDisturb')
                                }}
                                value={doNotDisturb}
                            />
                        </View>
                    </View>
                    <View style={styles.itemBackground}>
                        <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{navigation.navigate('VoicemailGreeting')}}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Voicemail Greeting</Text>
                            </View>
                            <View style={styles.arrowIconContainer}>
                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemBackground}>
                        <View style={styles.settingItemContainer}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Caller ID Blocking</Text>
                            </View>
                            <Switch
                                style={DeviceInfo.android?{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }:null}
                                trackColor={DeviceInfo.ios?{ false: Colors.white, true: Colors.green }:{ false: Colors.inputBottomBorder, true: Colors.appColorOpacity }}
                                thumbColor={blockCallerId ? DeviceInfo.ios?Colors.white:iconsColors.appColor : DeviceInfo.ios?Colors.white:Colors.androidSwitcherGray}
                                ios_backgroundColor={Colors.white}
                                onValueChange={()=>{
                                    this.changeBroadsoftStatuses('blockCallerId')
                                }}
                                value={blockCallerId}
                            />
                        </View>
                    </View>
                    <View style={styles.itemBackground}>
                        <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{navigation.navigate('BlockedNumbers')}}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Blocked Numbers</Text>
                            </View>
                            <View style={styles.arrowIconContainer}>
                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemBackground}>
                        <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{navigation.navigate('SubscriptionDetails')}}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Subscription</Text>
                            </View>
                            <View style={styles.arrowIconContainer}>
                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemBackground}>
                        <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{navigation.navigate('Account')}}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Account</Text>
                            </View>
                            <View style={styles.arrowIconContainer}>
                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemBackground}>
                        <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{
                            Instabug.show()
                        }}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Help & Support <Text style={{color: Colors.wrong}}>{supportRepliesCount}</Text></Text>
                            </View>
                            <View style={styles.arrowIconContainer}>
                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemBackground}>
                        <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{navigation.navigate('About')}}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>About</Text>
                            </View>
                            <View style={styles.arrowIconContainer}>
                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemBackground}>
                        <TouchableOpacity style={styles.settingItemContainer} onPress={this.openDeleteModal}>
                            <View style={styles.itemTextContainer}>
                                <Text style={styles.itemText}>Delete Account</Text>
                            </View>
                            <View style={styles.arrowIconContainer}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.signOutButton} onPress={this.signOut}>
                        <Text style={[styles.signOutText,DeviceInfo.android?styles.signOutTextAndroid:null]}>{DeviceInfo.ios?'Sign Out':'SIGN OUT'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(Settings)
