import React, {useContext, useRef, useMemo, useState, useEffect, memo} from 'react';
import AppContext from '../../AppContext';
import ChatService from '../../services/ChatService';
import styles from './styles';
import {StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Colors} from "../../assets/RootStyles";
import {sizes} from "../../assets/sizes";

const Stack = createNativeStackNavigator();
import {SearchInput} from '../../components';
import ContactsService from "../../services/ContactsService";
import {PhotoMessage, VideoMessage} from '../../assets/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from "react-redux";
import {
    ChannelPreviewStatus,
    ChannelList,
    Chat,
    Delete,
    useChannelsContext
} from 'stream-chat-react-native';
import ValidationService from "../../services/ValidationService";
import {makeAction} from "../../makeAction";
import {SET_UNREAD_MESSAGES_COUNT, UPDATE_UNSEEN_CHATS_COUNT} from "../../actionsTypes";
import NotificationService from "../../services/NotificationService";

let openedSwipeElement = null;
let openedSwipeElementCid = null;

const ImageComponent = ({contact, index, group}) => {
    const [contactCom, setContactCom] = useState(contact);

    return (
        index < 2 ? <View>
            {contactCom && contactCom.imageUri ? <Image
                style={[styles.userPhoto, group ? styles.userPhotoGroup : null, index === 1 ? styles.groupSecondAvatar : null]}
                resizeMode={'cover'}
                source={{uri: contact.imageUri}}
                onError={() => {
                    let con = {
                        ...contactCom,
                        imageUri: ''
                    };
                    setContactCom(con)
                }}
            /> : <View
                style={[styles.userPhoto, styles.defaultUserImageContainer, group ? styles.userPhotoGroup : null, index === 1 ? styles.groupSecondAvatar : null]}>
                <Image
                    style={group ? styles.defaultUserImageGroup : styles.defaultUserImage}
                    resizeMode={'cover'}
                    source={require('../../assets/images/default-chat-user-image.png')}
                />
            </View>}
        </View> : null
    )
};

const MemoizedImageComponent = memo(ImageComponent);

const CustomChannelPreview = (props) => {
    const unreadMessagesCount = useSelector(state => state.UserInfoReducer.unreadMessagesCount);
    const unreadHistoryCount = useSelector(state => state.UserInfoReducer.unreadHistoryCount);
    const dispatch = useDispatch();
    const [chatName, setChatName] = useState('');
    const [typingName, setTypingName] = useState('');
    const [contacts, setContacts] = useState([]);
    const {channel, searchInputText} = props;
    const swipeableElement = useRef(null);

    const checkName = (typing) => {
        AsyncStorage.getItem('currentUser').then((user) => {
            user = JSON.parse(user);
            let arr = Object.keys(typing);
            arr = arr.filter(item => typing[item].user?.orderedPhoneNumbers?.[0] !== user.orderedNumbers[0]);
            if (arr.length) {
                if (arr.length < 2) {
                    let number = typing[arr[0]].user?.orderedPhoneNumbers?.[0];
                    let contact = ContactsService.getContactByNumber(number);
                    let name = '';
                    let numberId = number;
                    if (contact) {
                        name = contact.givenName || contact.familyName ? `${contact.givenName ? contact.givenName + ' ' : ''}${contact.familyName ? contact.familyName : ''}` : `${ValidationService.parsePhoneNumber(numberId)}`;
                    } else {
                        name = ValidationService.parsePhoneNumber(numberId)
                    }
                    setTypingName(`${name} is typing`);
                } else if (arr.length > 2) {
                    setTypingName('Multiple people are typing');
                } else {
                    let name = '';
                    arr.forEach((item) => {
                        let number = typing[item].user?.orderedPhoneNumbers?.[0];
                        let contact = ContactsService.getContactByNumber(number);
                        let numberId = number;
                        if (contact) {
                            name = name ? `${name}` + ' and ' : '';
                            let contactName = contact.givenName || contact.familyName ? `${contact.givenName ? contact.givenName + ' ' : ''}${contact.familyName ? contact.familyName : ''}` : `${ValidationService.parsePhoneNumber(numberId)}`;
                            name = name + contactName
                        } else {
                            name = name ? name + ' and ' : '';
                            name = name + ValidationService.parsePhoneNumber(numberId)
                        }
                    });
                    setTypingName(`${name} are typing`);
                }
            }
        });
    };

    useEffect(() => {
        let channelEventListener = channel.on(() => {
            if (Object.keys(channel.state.typing).length) {
                checkName(channel.state.typing);
            } else {
                setTypingName('');
            }
        });

        AsyncStorage.getItem('currentUser').then((user) => {
            user = JSON.parse(user);
            let contacts = [];
            let chatName = '';

            props.channel.data.phoneNumbers.forEach((item) => {
                if (item !== user.orderedNumbers[0]) {
                    let contact = ContactsService.getContactByNumber(item);
                    if (contact) {
                        contact.chatName = item;
                        contacts.push(contact)
                    } else {
                        contacts.push({
                            chatName: ValidationService.parsePhoneNumber(item)
                        })
                    }
                }
            });

            contacts.forEach((contact) => {
                let name = '';
                if (contact) {
                    name = contact.givenName || contact.familyName ? `${contact.givenName ? contact.givenName + ' ' : ''}${contact.familyName ? contact.familyName : ''}` : `${contact.chatName}`;
                } else {
                    name = contact.chatName
                }
                chatName = chatName ? `${chatName}, ${name}` : `${name}`
            });
            if (Object.keys(channel.state.typing).length) {
                checkName(channel.state.typing);
            } else {
                setTypingName('');
            }
            setChatName(chatName);
            setContacts(contacts)
        });
        return () => {
            channelEventListener.unsubscribe()
        }
    }, []);

    const {onSelect} = useChannelsContext();

    const customDateFormatter = (date) => {
        return `${ValidationService.convertDateDivider(date)}`
    };

    return (
        chatName.toLowerCase().indexOf(searchInputText.toLowerCase()) > -1 ? <Swipeable
            ref={swipeableElement}
            onSwipeableRightWillOpen={() => {
                if (openedSwipeElement && openedSwipeElement.current && openedSwipeElementCid && channel.cid !== openedSwipeElementCid) {
                    openedSwipeElement.current.close()
                }
                openedSwipeElement = swipeableElement;
                openedSwipeElementCid = channel.cid;
            }}
            overshootLeft={false}
            overshootRight={false}
            renderRightActions={() => (
                <View style={[styles.swipeableContainer, {backgroundColor: Colors.wrong}]}>
                    <RectButton
                        onPress={async () => {
                            Alert.alert(
                                "Are you sure you want to delete the conversation?",
                                "All message history will be deleted \npermanently",
                                [
                                    {
                                        text: 'Cancel', onPress: () => {
                                        }
                                    },
                                    {
                                        text: 'Delete', style: 'destructive', onPress: async () => {
                                            await channel.hide(null, true);
                                            await ChatService.setup()

                                            if (channel.countUnread() > 0) {
                                                NotificationService.setApplicationIconBadgeNumber((unreadMessagesCount - 1) + unreadHistoryCount)
                                                dispatch(makeAction(UPDATE_UNSEEN_CHATS_COUNT, {
                                                    id: channel._client._user.id,
                                                    unread_channels: +unreadMessagesCount - 1
                                                }));
                                                dispatch(makeAction(SET_UNREAD_MESSAGES_COUNT, +unreadMessagesCount - 1));
                                            }
                                        }
                                    }
                                ]
                            );
                        }}
                        style={[styles.rightSwipeableButton]}
                    >
                        <Delete pathFill={Colors.white}/>
                    </RectButton>
                </View>
            )}
        >
            <TouchableOpacity
                style={[styles.previewContainer, channel.countUnread() > 0 ? {backgroundColor: Colors.lightBlue} : null]}
                onPress={() => onSelect(channel)}>
                <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                    {channel.countUnread() > 0 ? <View style={styles.marker}/> : null}
                    {contacts.length > 1 ? <View
                        style={[channel.countUnread() === 0 ? {marginLeft: sizes.size12} : null, {flexDirection: 'row'}]}>
                        {contacts.map((contact, index) => {
                            return (contact ?
                                <MemoizedImageComponent group={contacts.length > 1} key={index.toString()} index={index}
                                                        contact={contact} setContacts={setContacts}
                                                        contacts={contacts}/> : null)
                        })}
                    </View> : <View style={channel.countUnread() === 0 ? {marginLeft: sizes.size12} : null}>
                        {contacts[0] ?
                            <MemoizedImageComponent group={contacts.length > 1} index={0} contact={contacts[0]}
                                                    setContacts={setContacts} contacts={contacts}/> : null}
                    </View>}
                    <View style={{flexDirection: 'column', marginLeft: sizes.size10}}>
                        <Text style={styles.previewTitle} numberOfLines={1} ellipsizeMode={'tail'}>{chatName}</Text>
                        <View style={{marginLeft: sizes.size5}}>
                            {typingName ? <View style={styles.row}>
                                {
                                    channel.countUnread() > 0 ? <Image style={styles.loadingGif}
                                                                       source={require('../../assets/images/typing_blue.gif')}/>
                                        : <Image style={styles.loadingGif}
                                                 source={require('../../assets/images/typing.gif')}/>
                                }
                                <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {typingName}
                                </Text>
                            </View> : channel.lastMessage() ? <View>
                                {channel.lastMessage().type === 'deleted' ?
                                    <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode={'tail'}>
                                        Message deleted
                                    </Text> : channel.lastMessage().text && !channel.lastMessage().shadowed ?
                                        <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode={'tail'}>
                                            {channel.lastMessage().text}
                                        </Text> : channel.lastMessage().attachments.length ? <View style={styles.row}>
                                            {channel.lastMessage().attachments[0]?.type === 'image' ?
                                                <PhotoMessage width={sizes.size19} height={sizes.size19}/> :
                                                <VideoMessage width={sizes.size19} height={sizes.size19}/>}
                                            <Text style={styles.lastMessage} numberOfLines={1}
                                                  ellipsizeMode={'tail'}>{channel.lastMessage().attachments[0]?.type === 'image' ? 'Photo' : 'Video'}</Text>
                                        </View> : null}
                            </View> : null}
                        </View>
                    </View>
                </View>
                <ChannelPreviewStatus {...props} formatLatestMessageDate={customDateFormatter}/>
            </TouchableOpacity>
        </Swipeable> : null
    );
};

const ChannelListScreen = ({navigation}) => {
    const {setChannel} = useContext(AppContext);
    const searchInputRef = useRef();
    const [searchInputText, setSearchInputText] = useState('');
    const [listVisible, setListVisible] = useState(true);
    const memoizedFilters = useMemo(() => ChatService.filters, []);
    const chatInfo = useSelector(store => store.ChatReducer);

    const _handleChange = async (text) => {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        setSearchInputText(text);
        this.timer = setTimeout(() => {
            setListVisible(false);
            setTimeout(() => {
                setListVisible(true)
            }, 500)
        }, 500)
    };

    // ChatService.chatClient.on("message.new", event => {
    //     // console.log(44555, event)
    // });

    // const customOnMessageNew = async (setChannels, event) => {
    //     console.log(1111111)
    //     const eventChannel = event.channel;
    //
    //     // If the channel isn't frozen, then don't add it to the list.
    //     if (!eventChannel?.id || !eventChannel.frozen) return;
    //
    //     try {
    //         const newChannel = ChatService.chatClient.channel(eventChannel.type, eventChannel.id);
    //         await newChannel.watch();
    //         setChannels((channels) => [newChannel, ...channels]);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <Chat client={ChatService.chatClient}>
            <View style={[StyleSheet.absoluteFill, {backgroundColor: Colors.white}]}>
                <View style={styles.searchInput}>
                    <SearchInput
                        placeholder='Search'
                        returnKeyType='search'
                        onChange={_handleChange}
                        value={searchInputText}
                        ref={searchInputRef}
                    />
                </View>
                {listVisible && chatInfo.showChannelsList ? <ChannelList
                    filters={memoizedFilters}
                    onSelect={(channel) => {
                        setChannel(channel);
                        navigation.navigate('ChannelScreen');
                    }}
                    options={ChatService.options}
                    Preview={(props) => {
                        return CustomChannelPreview({...props, searchInputText: searchInputText})
                    }}
                    sort={ChatService.sort}
                /> : null}
            </View>
        </Chat>
    );
};

const ChatSDK = () => {
    return (
        <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="ChannelList"
        >
            <Stack.Screen
                component={ChannelListScreen}
                name="ChannelList"
            />
        </Stack.Navigator>
    );
};

export default ChatSDK
