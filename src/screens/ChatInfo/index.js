import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    Text,
    ScrollView,
    View,
    TouchableOpacity,
    TextInput,
    Alert, Linking
} from 'react-native';
import styles from './styles';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {TabScreenHeader} from "../../components/TabScreenHeader";
import FastImage from "react-native-fast-image";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactsService from "../../services/ContactsService";
import ChatService from "../../services/ChatService";
import {ArrowRight, ContactCall, ContactMessage, Message} from "../../assets/icons";
import {sizes} from "../../assets/sizes";
import {Colors, iconsColors} from "../../assets/RootStyles";
import moment from 'moment';
import {ScreenLoader} from "../../components/ScreenLoader";
import {BLOCK_NUMBER, GENERATE_OUTGOING_CALL_NUMBER, GET_BLOCKED_CONTACTS, UNBLOCK_NUMBER} from "../../actionsTypes";
import AlertService from "../../services/AlertService";
import {useDispatch} from "react-redux";
import {makeAction} from "../../makeAction";
import ValidationService from "../../services/ValidationService";

const ChatInfo = (props)=>{
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [channel, setChannel] = useState(null);
    const [numberId, setNumberId] = useState(null);
    const [contact, setContact] = useState({});
    const [contacts, setContacts] = useState([]);
    const [name, setName] = useState(null);
    const [medias, setMedias] = useState([]);
    const [links, setLinks] = useState([]);
    const [mediaCounts, setMediaCounts] = useState(0);
    const [targetUser, setTargetUser] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('currentUser').then(async (user)=>{
            user = JSON.parse(user);
            const filter = {members: { $in: [user.id] }, phoneNumbers: { $eq: props.route.params?.numbers} };
            const sort = [{ last_message_at: -1 }];
            await ChatService.chatClient.queryChannels(filter, sort, {
                watch: true,
                state: true,
            }).then(async (res)=>{
                let channel = res[0];
                setChannel(res[0]);

                channel.queryMembers({}, {created_at: -1}, {}).then(async (res) => {
                    Object.entries(res.members).map(([key, value]) => {
                        if (value.user_id !== user.id) {
                            setTargetUser(value)
                        }
                    })
                })

                if (channel.data.phoneNumbers.length < 3 || props.route.params?.onlyInfo) {
                    AsyncStorage.getItem('currentUser').then((user) => {
                        user = JSON.parse(user);
                        let contact = null;
                        let numberId = '';
                        if(props.route.params?.contact){
                            contact = ContactsService.getContactByNumber(props.route.params?.contact.name);
                            numberId = props.route.params?.contact.name;
                            setNumberId(numberId)
                        }else {
                            channel.data.phoneNumbers.forEach((item)=>{
                                if(item !== user.orderedNumbers[0]){
                                    contact = ContactsService.getContactByNumber(item);
                                    numberId = item;
                                    setNumberId(numberId)
                                }
                            });
                        }
                        let name = '';
                        if(props.route.params?.onlyInfo){
                            contact = props.route.params?.contact;
                        }
                        if(contact){
                            name = contact.givenName || contact.familyName?`${contact.givenName?contact.givenName+' ':''}${contact.familyName?contact.familyName:''}`:`${ValidationService.parsePhoneNumber(numberId)}`;
                        }else {
                            name = ValidationService.parsePhoneNumber(numberId)
                        }
                        setContact(contact?contact:{});
                        setName(name);
                    });
                }else{
                    AsyncStorage.getItem('currentUser').then((user)=>{
                        user = JSON.parse(user);
                        let contact = null;
                        let contacts = [];
                        channel.data.phoneNumbers.forEach((item)=>{
                            if(`${item}` !== `${user.orderedNumbers[0]}`){
                                contact = ContactsService.getContactByNumber(item);
                                if(contact){
                                    contact.name = item;
                                    contacts = [...contacts,contact];
                                }else {
                                    contacts = [...contacts,{name: ValidationService.parsePhoneNumber(item)}];
                                }
                            }
                        });
                        setContacts(contacts)
                    });
                }
                await fetchAttachments(channel);
            });
        });
    }, []);

    let convertDate = (date)=>{
        return moment(date).format('ll');
    };

    const group = (arr)=>{
        let groupNewMessages = [];
        arr.forEach((item)=>{
            let dateGroup = convertDate(item.created_at);
            let index = groupNewMessages.findIndex(i=>i.date === dateGroup);
            if(index>-1){
                groupNewMessages[index].data.push(item)
            }else {
                groupNewMessages.push({
                    date: `${dateGroup}`,
                    data: [item]
                })
            }
        });
        return groupNewMessages;
    };

    const fetchAttachments = async (channel) => {
        let count = 0;
        try {
            let newMessages = [];

            const res = await ChatService.chatClient.search(
                {
                    cid: { $in: [channel.cid] },
                },
                { 'attachments.type': { $in: ['image'] } },
                {
                    limit: 1000,
                    offset: 0,
                },
            );
            res?.results.forEach((item)=>{
                let date = new Date(item.message.created_at).toUTCString();
                item.message.attachments.forEach((image)=>{
                    if(!image.og_scrape_url){
                        image.created_at = date;
                        newMessages.push(image);
                        count++
                    }
                })
            });
            const resFile = await ChatService.chatClient.search(
                {
                    cid: { $in: [channel.cid] },
                },
                { 'attachments.type': { $in: ['file'] } },
                {
                    limit: 1000,
                    offset: 0,
                },
            );
            resFile?.results.forEach((item)=>{
                let date = new Date(item.message.created_at).toUTCString();
                item.message.attachments.forEach((video)=>{
                    video.created_at = date;
                    newMessages.push(video);
                    count++
                })
            });
            const resVideo = await ChatService.chatClient.search(
                {
                    cid: { $in: [channel.cid] },
                },
                { 'attachments.type': { $in: ['video'] } },
                {
                    limit: 1000,
                    offset: 0,
                },
            );
            resVideo?.results.forEach((item)=>{
                let date = new Date(item.message.created_at).toUTCString();
                item.message.attachments.forEach((video)=>{
                    video.created_at = date;
                    newMessages.push(video);
                    count++
                })
            });
            newMessages = group(newMessages);
            setMedias(newMessages);

            const resLinks = await ChatService.chatClient.search(
                {
                    cid: { $in: [channel.cid] },
                },
                { attachments: { $exists: true } },
                {
                    limit: 1000,
                    offset: 0,
                },
            );
            let newMessagesLink = [];
            resLinks?.results.forEach((item)=>{
                let date = new Date(item.message.created_at).toUTCString();
                item.message.attachments.forEach((link)=>{
                    if(link.og_scrape_url){
                        link.text = item.message.text;
                        link.created_at = date;
                        newMessagesLink.push(link);
                        count++
                    }
                })
            });
            setMediaCounts(count);
            newMessagesLink = group(newMessagesLink);
            setLinks(newMessagesLink);
            setLoading(false);
        } catch (e) {
            console.log(e)
        }
    };

    const call = async (number)=>{
        setLoading(true);
        dispatch(makeAction(GENERATE_OUTGOING_CALL_NUMBER,{
            callback: async (data)=>{
                await AlertService.call(data.imrn);
                setLoading(false);
            },
            error: ()=>{
                setLoading(false);

            },
            number: number
        }));
    };

    const blockNumber = (blocked) => {
        // dispatch(makeAction(blocked?UNBLOCK_NUMBER:BLOCK_NUMBER,{
        //     callback: ()=>{
        //         dispatch(makeAction(GET_BLOCKED_CONTACTS,{
        //             callback: ()=>{
        //                 try {
        //                     setLoading(false);
        //                     setContact({
        //                         ...contact,
        //                         isBlocked: !blocked
        //                     });
        //                 }catch (e){
        //                     console.log(e)
        //                 }
        //             },
        //             error: ()=>{
        //                 setLoading(false);
        //             }
        //         }));
        //     },
        //     error: ()=>{
        //         setLoading(false);
        //     },
        //     contactId: contact.id
        // }))

        if (blocked) {
            channel.removeShadowBan(targetUser.user_id).then((res) => {
                setTargetUser({...targetUser, shadow_banned: false})
                setLoading(false);
            })
        } else {
            channel.shadowBan(targetUser.user_id).then((res) => {
                setTargetUser({...targetUser, shadow_banned: true})
                setLoading(false);
            })
        }
    };

    const blockContact = (blocked)=>{
        if(!loading){
            setLoading(true);
        }

        if(blocked){
            blockNumber(blocked);
        }else {
            Alert.alert(
                "Are you sure you want to \nblock this contact?",
                "You will not receive calls and messages \nfrom people in the block list.",
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                            setLoading(false);
                        }
                    },
                    {
                        text: 'Block',
                        style: 'destructive',
                        onPress: () => {
                            blockNumber(blocked)
                        }
                    }
                ]
            );
        }
    };

    return (
        channel?<KeyboardAvoidingView
            style={styles.screen}
            behavior={DeviceInfo.ios ? "padding" : "height"}
        >
            {loading?<ScreenLoader/>:null}
            <View style={styles.screen}>
                <View style={styles.headerContainer}>
                    <TabScreenHeader
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            props.navigation.goBack()
                        }}
                        title={'Chat Info'}
                    />
                </View>
                {channel.data.phoneNumbers.length<3 || props.route.params?.onlyInfo?<ScrollView>
                    <View style={styles.imageContainer}>
                        {contact.imageUri?<FastImage
                            style={[styles.userPhoto]}
                            resizeMode={FastImage.resizeMode.cover}
                            source={{uri: contact.imageUri}}
                            onError={()=>{
                                setContact({
                                    ...contact,
                                    imageUri: ''
                                })
                            }}
                        />:<View style={[styles.userPhoto,styles.defaultUserImageContainer]}>
                            <FastImage
                                style={[styles.defaultUserImage]}
                                resizeMode={FastImage.resizeMode.cover}
                                source={require('../../assets/images/defaultUserImage.png')}
                            />
                        </View>}
                    </View>
                    <View style={styles.userNameContainer}>
                        <Text style={styles.userName} numberOfLines={2} ellipsizeMode={'tail'}>
                            {`${name}`}
                        </Text>
                    </View>
                    {!props.route.params?.onlyInfo?<TouchableOpacity style={styles.mediaButton} onPress={()=>{props.navigation.navigate('AttachmentsMenu',{Links: links, Media: medias, number: numberId})}}>
                        <Text style={styles.mediaButtonText}>Media, Links and more</Text>
                        <View style={styles.row}>
                            <Text style={styles.mediaButtonText}>{mediaCounts?mediaCounts:''}</Text>
                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                        </View>
                    </TouchableOpacity>:null}
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
                                                let data = {
                                                    givenName: contact.givenName,
                                                    familyName: contact.familyName,
                                                    phoneNumber: phoneNumber.number,
                                                    label: phoneNumber.label,
                                                    id: contact.id
                                                };
                                                props.navigation.push('Chat', {appContextNoChange: true, phoneNumber: phoneNumber.number, chatData: data, label: phoneNumber.label});
                                            }}>
                                                <ContactMessage width={sizes.size40} height={sizes.size40} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.contactCallButton} onPress={async ()=>{
                                                await call(phoneNumber.number)
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
                    {!contact.id?<View style={styles.blockContainer}>
                        <View style={[styles.phoneNumberRow,{borderBottomWidth: 0}]}>
                            <View>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>{`${name}`}</Text>
                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemText}>Phone</Text>
                            </View>
                            <View style={styles.rowContainer}>
                                <TouchableOpacity onPress={()=>{
                                    let data = {
                                        givenName: '',
                                        familyName: '',
                                        phoneNumber: name,
                                        label: 'Phone',
                                        id: ''
                                    };
                                    props.navigation.push('Chat', {appContextNoChange: true, phoneNumber: name, chatData: data, label: 'Phone'});
                                }}>
                                    <ContactMessage width={sizes.size40} height={sizes.size40} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.contactCallButton} onPress={async ()=>{
                                    await call(name)
                                }}>
                                    <ContactCall width={sizes.size40} height={sizes.size40} />
                                </TouchableOpacity>
                            </View>
                        </View>
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
                    </View> : null}
                    {/*{contact.id ? <TouchableOpacity style={[styles.blockContainer]} onPress={() => {*/}
                    {targetUser ? <TouchableOpacity style={[styles.blockContainer]} onPress={() => {
                        // blockContact(contact.isBlocked)
                        blockContact(targetUser.shadow_banned)
                    }}>
                        <View style={[styles.phoneNumberRow, {borderBottomWidth: 0}]}>
                            <Text
                                // style={styles.actionButtonText}>{contact.isBlocked ? 'Unblock Contact' : 'Block Contact'}</Text>
                                style={styles.actionButtonText}>{targetUser.shadow_banned ? 'Unblock Contact' : 'Block Contact'}</Text>
                        </View>
                    </TouchableOpacity>:null}
                </ScrollView>:<ScrollView>
                    <TouchableOpacity style={[styles.mediaButton,{marginTop: sizes.size15, marginBottom: sizes.size35}]} onPress={()=>{props.navigation.navigate('AttachmentsMenu',{Links: links, Media: medias})}}>
                        <Text style={styles.mediaButtonText}>Media and Links</Text>
                        <View style={styles.row}>
                            <Text style={styles.mediaButtonText}>{mediaCounts?mediaCounts:''}</Text>
                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.participants}>CHAT PARTICIPANTS</Text>
                    <View style={styles.blockContainer}>
                        {
                            contacts.map((contact, index)=>{
                                return (
                                    contact.id?<TouchableOpacity
                                            key={index.toString()}
                                            style={[styles.phoneNumberRow]}
                                            onPress={()=>{
                                                props.navigation.push('ChatInfo', {contact: contact, onlyInfo: true, numbers: props.route.params?.numbers})
                                            }}
                                        >
                                            <View>
                                                {contact.givenName || contact.familyName?<Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.labelText}>{contact.givenName || contact.familyName?`${contact.givenName?contact.givenName+' ':''}${contact.familyName?contact.familyName:''}`:``}</Text>:null}
                                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemText}>{contact.name}</Text>
                                            </View>
                                            <View style={styles.rowContainer}>
                                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                                            </View>
                                        </TouchableOpacity>
                                        :<TouchableOpacity
                                            key={index.toString()}
                                            style={[styles.phoneNumberRow, index === contacts.length-1?{borderBottomWidth: 0}:null]}
                                            onPress={()=>{
                                                props.navigation.push('ChatInfo', {contact: contact, onlyInfo: true, numbers: props.route.params?.numbers})
                                            }}
                                        >
                                            <View>
                                                <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemText}>{contact.name}</Text>
                                            </View>
                                            <View style={styles.rowContainer}>
                                                <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                                            </View>
                                        </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </ScrollView>}
            </View>
        </KeyboardAvoidingView>:null
    );
};

export default ChatInfo
