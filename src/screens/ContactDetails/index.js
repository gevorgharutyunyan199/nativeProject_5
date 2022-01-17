import React, {Component, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
    TouchableWithoutFeedback,
    Modal,
    KeyboardAvoidingView,
    Linking,
    TextInput
} from 'react-native';
import styles from './styles';
import {ScreenLoader, TabScreenHeader, AndroidAlertDialog} from '../../components';
import {Colors} from '../../assets/RootStyles';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {sizes} from "../../assets/sizes";
import {DeleteChat, Message, ContactMessage, ContactCall, Edit, Block} from "../../assets/icons";
import AlertService from '../../services/AlertService';
import FastImage from 'react-native-fast-image';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {
    BLOCK_NUMBER,
    DELETE_CONTACT,
    GENERATE_OUTGOING_CALL_NUMBER,
    GET_BLOCKED_CONTACTS,
    GET_CONTACT_BY_ID,
    UNBLOCK_NUMBER
} from "../../actionsTypes";
import ContactsService from "../../services/ContactsService";
import ValidationService from "../../services/ValidationService";
import ChatService from "../../services/ChatService";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ContactDetails extends Component {

    state = {
        loaderVisible: false,
        contact: {},
        menuVisible: false,
        scrollPosition: {
            last: 0,
            size: 1
        },
        targetUser: null,
        channel: null

    };

    componentDidMount() {
        const {route} = this.props;
        let unknownNumber = route.params && route.params.unknownNumber;
        if(unknownNumber){
            this.setState({
                contact: {
                    phoneNumbers: [{
                        label: 'home',
                        number: route.params.unknownNumber.phoneNumber !== 'Unavailable'?route.params.unknownNumber.phoneNumber:''
                    }]
                },
                loaderVisible: false
            })
        }else {
            this.loadContactInfo()
        }
    }

    loadContactInfo = ()=>{
        const {route} = this.props;

        let contact = ContactsService.getContactById(route.params.id);

        try {
            this.setState({
                loaderVisible: false,
                contact: contact
            })
        }catch (e){
            console.log(e)
        }

        AsyncStorage.getItem('currentUser').then((user)=>{
            user = JSON.parse(user);
            const filter = {members: { $in: [user.id] }, phoneNumbers: { $eq: [user.orderedNumbers[0], contact.phoneNumbers?.[0].number.replace('+', '')]} };
            const sort = [{ last_message_at: -1 }];

            ChatService.chatClient.queryChannels(filter, sort, {
                watch: true,
                state: true,
            }).then( (res)=>{
                const channel = res[0]
                this.setState({channel})

                channel.queryMembers({}, {created_at: -1}, {}).then((res) => {
                    Object.entries(res.members).map(([key, value]) => {
                        if (value.user_id !== user.id) {
                            this.setState({targetUser: value})
                        }
                    })
                })
            });
        })
    };

    blockNumber = (blocked)=>{
        const {channel, targetUser} = this.state
        console.log(222222222, targetUser)
        if (blocked) {
            channel.removeShadowBan(targetUser.user_id).then((res) => {
                this.setState({
                    targetUser: {...targetUser, shadow_banned: false},
                    loaderVisible: false
                })
            })
        } else {
            channel.shadowBan(targetUser.user_id).then((res) => {
                this.setState({
                    targetUser: {...targetUser, shadow_banned: true},
                    loaderVisible: false
                })
            })
        }

        // const {makeAction} = this.props;
        // const {contact} = this.state;

        // makeAction(blocked?UNBLOCK_NUMBER:BLOCK_NUMBER,{
        //     callback: ()=>{
        //         makeAction(GET_BLOCKED_CONTACTS,{
        //             callback: ()=>{
        //                 try {
        //                     this.setState({
        //                         loaderVisible: false,
        //                         contact: {
        //                             ...contact,
        //                             isBlocked: !blocked
        //                         }
        //                     })
        //                 }catch (e){
        //                     console.log(e)
        //                 }
        //             },
        //             error: ()=>{
        //                 this.setState({
        //                     loaderVisible: false
        //                 })
        //             }
        //         });
        //     },
        //     error: ()=>{
        //         this.setState({
        //             loaderVisible: false
        //         })
        //     },
        //     contactId: contact.id
        // })
    };

    blockContact = (blocked)=>{
        const {loaderVisible} = this.state;

        if(DeviceInfo.android){
            this.closeMenu()
        }

        if(!loaderVisible){
            this.setState({
                loaderVisible: true
            })
        }

        if(blocked){
            this.blockNumber(blocked);
        }else {
            if(DeviceInfo.ios){
                Alert.alert(
                    "Are you sure you want to \nblock this contact?",
                    "You will not receive calls and messages \nfrom people in the block list.",
                    [
                        {
                            text: 'Cancel',
                            onPress: () => {
                                this.setState({
                                    loaderVisible: false
                                })
                            }
                        },
                        {
                            text: 'Block',
                            style: 'destructive',
                            onPress: () => {
                                this.blockNumber(blocked)
                            }
                        }
                    ]
                );
            }else {
                this.androidAlertDialog.openDialog({
                    title: 'Are you sure you want to block this contact?',
                    body: 'You will not receive calls and messages from people in the block list.',
                    buttons: [{
                        title: 'CANCEL',
                        onPress: ()=>{
                            this.setState({
                                loaderVisible: false
                            })
                        }
                    },{
                        title: 'BLOCK',
                        wrong: true,
                        onPress: ()=>{
                            this.blockNumber(blocked)
                        }
                    }]
                })
            }
        }
    };

    edit = ()=>{
        const {navigation,route} = this.props;
        const {contact} = this.state;

        if(DeviceInfo.android){
            this.closeMenu()
        }

        navigation.navigate('EditContact',{
            index: route.params.index,
            getContacts: route.params.getContacts,
            loadContactInfo: this.loadContactInfo,
            contact: contact,
            rootScreen: route.params.rootScreen
        })
    };

    call = async (number)=>{
        this.setState({
            loaderVisible: true
        });
        this.props.makeAction(GENERATE_OUTGOING_CALL_NUMBER,{
            callback: async (data)=>{
                await AlertService.call(data.imrn);
                this.setState({
                    loaderVisible: false
                })
            },
            error: ()=>{
                this.setState({
                    loaderVisible: false
                })
            },
            number: number
        });
    };

    openMenu = ()=>{
        this.setState({
            menuVisible: true
        })
    };

    closeMenu = ()=>{
        this.setState({
            menuVisible: false
        })
    };

    openUrl = async (url)=>{
        const supportedHttps = await Linking.canOpenURL(`https://${url}`);
        if (supportedHttps) {
            await Linking.openURL(`https://${url}`);
            return
        }
        const supportedHttp = await Linking.canOpenURL(`http://${url}`);
        if (supportedHttp) {
            await Linking.openURL(`http://${url}`);
        }
    };

    deleteContact = ()=>{
        const {makeAction, route, navigation} = this.props;
        const {contact} = this.state;

        if(DeviceInfo.android){
            this.closeMenu()
        }

        if(DeviceInfo.ios){
            Alert.alert(
                "Are you sure you want to \ndelete this contact?",
                "",
                [
                    {
                        text: 'Cancel',
                        onPress: () => {}
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            this.setState({
                                loaderVisible: true
                            });
                            makeAction(DELETE_CONTACT,{
                                callback: ()=>{
                                    try {
                                        this.setState({
                                            loaderVisible: false
                                        });
                                        navigation.goBack();
                                    }catch (e){
                                        console.log(e)
                                    }
                                },
                                error: ()=>{
                                    this.setState({
                                        loaderVisible: false
                                    })
                                },
                                contact: contact
                            });
                        }
                    }
                ]
            );
        }else {
            this.androidAlertDialog.openDialog({
                title: 'Are you sure you want to delete this contact?',
                body: '',
                buttons: [{
                    title: 'CANCEL',
                    onPress: ()=>{}
                },{
                    title: 'DELETE',
                    wrong: true,
                    onPress: ()=>{
                        this.setState({
                            loaderVisible: true
                        });
                        makeAction(DELETE_CONTACT,{
                            callback: ()=>{
                                try {
                                    this.setState({
                                        loaderVisible: false
                                    });
                                    navigation.goBack();
                                }catch (e){
                                    console.log(e)
                                }
                            },
                            error: ()=>{
                                this.setState({
                                    loaderVisible: false
                                })
                            },
                            contact: contact
                        });
                    }
                }]
            })
        }
    };

    onScrollView = ({nativeEvent}) => {
        if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height) {
            return
        }
        if (nativeEvent.contentOffset.y > 0 && this.state.scrollPosition.size > 0.5 && nativeEvent.contentOffset.y > this.state.scrollPosition.last) {
            this.setState({
                scrollPosition: {
                    last: nativeEvent.contentOffset.y,
                    size: nativeEvent.contentOffset.y > sizes.size75 ? 0.5 : this.state.scrollPosition.size - 0.1
                }
            })
        } else if (this.state.scrollPosition.size < 1 && nativeEvent.contentOffset.y <= this.state.scrollPosition.last) {
            this.setState({
                scrollPosition: {
                    last: nativeEvent.contentOffset.y,
                    size: this.state.scrollPosition.size + 0.1
                }
            })
        }
    };



    render() {
        const {navigation,route} = this.props;
        const {loaderVisible,contact,menuVisible, targetUser} = this.state;
        let unknownNumber = route.params && route.params.unknownNumber;
        let blocked = contact.isBlocked;
        console.log(55555, targetUser?.shadow_banned)
        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios?"padding":"height"}
            >
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={menuVisible}
                >
                    <TouchableWithoutFeedback onPress={this.closeMenu}>
                        <View style={styles.androidMenu}>
                            <View style={styles.menuButtonMarginTop}>
                                { !unknownNumber?<TouchableOpacity style={[styles.menuButton]} onPress={this.edit}>
                                    <Edit width={sizes.size32} height={sizes.size32} />
                                    <Text style={styles.menuButtonText}>Edit</Text>
                                </TouchableOpacity>:null}
                                {/*<TouchableOpacity style={[styles.menuButton]} onPress={()=>{this.blockContact(blocked)}}>*/}
                                <TouchableOpacity style={[styles.menuButton]} onPress={()=>{this.blockContact(targetUser?.shadow_banned)}}>
                                    <Block width={sizes.size32} height={sizes.size32} />
                                    {/*<Text style={styles.menuButtonText}>{blocked?'Unblock':'Block'}</Text>*/}
                                    <Text style={styles.menuButtonText}>{targetUser?.shadow_banned?'Unblock':'Block'}</Text>
                                </TouchableOpacity>
                                {!unknownNumber?<TouchableOpacity style={styles.menuButton} onPress={this.deleteContact}>
                                    <DeleteChat width={sizes.size32} height={sizes.size32} />
                                    <Text style={styles.menuButtonText}>Delete</Text>
                                </TouchableOpacity>:null}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {loaderVisible?<ScreenLoader/>:null}
                <AndroidAlertDialog ref={ref => this.androidAlertDialog = ref}/>
                <View style={styles.headerContainer}>
                    {DeviceInfo.ios?<TabScreenHeader
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                        title={'Contact Details'}
                        rightIcon={!unknownNumber?'edit':null}
                        rightIconPress={this.edit}
                    />:<TabScreenHeader
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                        title={'Contact Details'}
                        rightIcon={'menu'}
                        rightIconPress={this.openMenu}
                    />}
                </View>
                <View style={styles.imageContainer}>
                    {contact.imageUri?<FastImage
                        style={[styles.userPhoto,{
                            borderWidth: sizes.size3 * this.state.scrollPosition.size,
                            width: sizes.size110 * this.state.scrollPosition.size,
                            height: sizes.size110 * this.state.scrollPosition.size
                        }]}
                        resizeMode={FastImage.resizeMode.cover}
                        source={{uri: contact.imageUri}}
                        onError={()=>{
                            this.setState({
                                contact: {
                                    ...this.state.contact,
                                    imageUri: ''
                                }
                            })
                        }}
                    />:<View style={[styles.userPhoto,styles.defaultUserImageContainer,{
                        borderWidth: sizes.size3 * this.state.scrollPosition.size,
                        width: sizes.size110 * this.state.scrollPosition.size,
                        height: sizes.size110 * this.state.scrollPosition.size
                    }]}>
                        <FastImage
                            style={[styles.defaultUserImage,{
                                width: sizes.size41 * this.state.scrollPosition.size,
                                height: sizes.size45 * this.state.scrollPosition.size
                            }]}
                            resizeMode={FastImage.resizeMode.cover}
                            source={require('../../assets/images/defaultUserImage.png')}
                        />
                    </View>}
                </View>
                <View style={styles.userNameContainer}>
                    <Text style={styles.userName} numberOfLines={2} ellipsizeMode={'tail'}>
                        {`${contact.givenName?contact.givenName+' ':''}${contact.familyName?contact.familyName:''}`}
                    </Text>
                    {contact.company?<Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>{contact.company}</Text>:null}
                </View>
                <ScrollView
                    nestedScrollEnabled={true}
                    scrollEventThrottle={16}
                    onScroll={this.onScrollView}
                >
                    {contact.phoneNumbers?.length?<View style={styles.blockContainer}>
                        {
                            contact.phoneNumbers.map((phoneNumber,index)=>{
                               return(
                                   <View style={[styles.phoneNumberRow,index===contact.phoneNumbers.length-1?{borderBottomWidth: 0}:null]} key={index.toString()}>
                                       <View>
                                           <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>{phoneNumber.label}</Text>
                                           <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemText}>{ValidationService.parsePhoneNumber(phoneNumber.number)}</Text>
                                       </View>
                                       <View style={styles.rowContainer}>
                                           <TouchableOpacity onPress={()=>{
                                               if(this.props.route.params && this.props.route.params.suggestionPress){
                                                   let data = {
                                                       givenName: contact.givenName,
                                                       familyName: contact.familyName,
                                                       phoneNumber: phoneNumber.number,
                                                       label: phoneNumber.label,
                                                       id: contact.id
                                                   };
                                                   this.props.route.params.suggestionPress(data);
                                                   setTimeout(()=>{
                                                       this.props.navigation.goBack();
                                                       this.props.navigation.goBack();
                                                   },300);
                                                   return
                                               }
                                               let data = {
                                                   givenName: contact.givenName,
                                                   familyName: contact.familyName,
                                                   phoneNumber: phoneNumber.number,
                                                   label: phoneNumber.label,
                                                   id: contact.id
                                               };
                                               this.props.navigation.push('Chat', {phoneNumber: phoneNumber.number, chatData: data, label: phoneNumber.label});
                                           }}>
                                               <ContactMessage width={sizes.size40} height={sizes.size40} />
                                           </TouchableOpacity>
                                           <TouchableOpacity style={styles.contactCallButton} onPress={async ()=>{
                                               await this.call(phoneNumber.number)
                                           }}>
                                               <ContactCall width={sizes.size40} height={sizes.size40} />
                                           </TouchableOpacity>
                                       </View>
                                   </View>
                               )
                            })
                        }
                    </View>:null}
                    {contact.emailAddresses?.length?<View style={styles.blockContainer}>
                        {
                            contact.emailAddresses.map((item,index)=>{
                                return(
                                    <View style={[styles.phoneNumberRow,index===contact.emailAddresses.length-1?{borderBottomWidth: 0}:null]} key={index.toString()}>
                                        <View>
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>{item.label}</Text>
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemText}>{item.email}</Text>
                                        </View>
                                        <View style={styles.rowContainer}>
                                            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.email}`) }>
                                                <Message width={sizes.size40} height={sizes.size40} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>:null}
                    {contact.textTone?<View style={styles.blockContainer}>
                        <View style={[styles.phoneNumberRow,{borderBottomWidth: 0}]}>
                            <View>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>Text Tone</Text>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemText}>Sound: {contact.textTone.label}</Text>
                            </View>
                        </View>
                    </View>:null}
                    {contact.urlAddresses?.length?<View style={styles.blockContainer}>
                        {
                            contact.urlAddresses.map((item,index)=>{
                                return(
                                    <View style={[styles.phoneNumberRow,index===contact.urlAddresses.length-1?{borderBottomWidth: 0}:null]} key={index.toString()}>
                                        <View>
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>{item.label}</Text>
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemText} onPress={async()=>{await this.openUrl(item.url)}}>{item.url}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>:null}
                    {contact.postalAddresses?.length?<View style={styles.blockContainer}>
                        {
                            contact.postalAddresses.map((item,index)=>{
                                return(
                                    <View style={[styles.phoneNumberRow,index===contact.postalAddresses.length-1?{borderBottomWidth: 0}:null]} key={index.toString()}>
                                        <View>
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>{item.label}</Text>
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.itemText,{color: Colors.black}]}>{item.country}</Text>
                                            {item.region?<Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.itemText,{color: Colors.black}]}>{item.region}</Text>:null}
                                            {item.street?<Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.itemText,{color: Colors.black}]}>{item.street}</Text>:null}
                                            {item.address?<Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.itemText,{color: Colors.black}]}>{item.address}</Text>:null}
                                            {item.postCode?<Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.itemText,{color: Colors.black}]}>{item.postCode}</Text>:null}
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>:null}
                    {contact.notes?<View style={styles.blockContainer}>
                        <View style={[styles.phoneNumberRow,{borderBottomWidth: 0}]}>
                            <View>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>Notes</Text>
                                <TextInput
                                    style={[styles.itemText,{color: Colors.black}]}
                                    value={contact.notes}
                                    editable={false}
                                    multiline
                                />
                            </View>
                        </View>
                    </View>:null}
                    {DeviceInfo.ios && contact.id?<TouchableOpacity
                        style={[styles.blockContainer, !unknownNumber?{marginBottom: sizes.size40}:null]}
                        onPress={()=>{this.blockContact(targetUser?.shadow_banned)}}
                    >
                        <View style={[styles.phoneNumberRow,{borderBottomWidth: 0}]}>
                            <Text style={styles.actionButtonText}>{targetUser?.shadow_banned?'Unblock Contact':'Block Contact'}</Text>
                        </View>
                    </TouchableOpacity>:null}
                    {unknownNumber?<TouchableOpacity style={[styles.blockContainer, {marginBottom: sizes.size40}]}
                        onPress={()=>{
                            navigation.replace('EditContact', {
                                getContacts: route.params.getContacts,
                                unknownNumber: unknownNumber,
                                rootScreen: route.params.rootScreen
                            })
                        }}
                    >
                        <View style={[styles.phoneNumberRow,{borderBottomWidth: 0}]}>
                            <Text style={[styles.actionButtonText,{color: Colors.cancel},DeviceInfo.android?styles.androidButtonText:{}]}>{DeviceInfo.ios?'Create New Contact':'CREATE NEW CONTACT'}</Text>
                        </View>
                    </TouchableOpacity>:null}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(ContactDetails)
