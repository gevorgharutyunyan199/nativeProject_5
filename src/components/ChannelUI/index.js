import React, {useEffect, useContext, useState} from 'react';
import AppContext from '../../AppContext';
import {useHeaderHeight} from '@react-navigation/elements';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator
} from 'react-native';
import {
    Channel,
    Chat,
    MessageInput,
    MessageList,
    useAttachmentPickerContext,
    useMessageContext,
    useTypingContext,
    MessageFooter,
    FileAttachment,
    MessageStatus,
    MessageSimple,
    MessageContent,
    Gallery
} from 'stream-chat-react-native';
import ChatService from "../../services/ChatService";
import ContactsService from "../../services/ContactsService";
import styles from './styles';
import {sizes} from "../../assets/sizes";
import {Attach, ChatCall, Info, PlayVideo} from '../../assets/icons';
import {Colors} from "../../assets/RootStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {makeAction} from "../../makeAction";
import {GENERATE_OUTGOING_CALL_NUMBER, GET_BADGES, SET_ACTIVE_CHAT_ID} from "../../actionsTypes";
import AlertService from "../../services/AlertService";
import {connect, useDispatch, useSelector} from "react-redux";
import Video from 'react-native-video';
import {AttachCustomButton} from "../AttachCustomButton";
import {DeviceInfo} from "../../assets/DeviceInfo";
import ValidationService from "../../services/ValidationService";
import {Divider} from "../../components";
import RNFetchBlob from 'rn-fetch-blob';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import {makeTheme} from "../../helpers";
import Markdown from 'react-native-markdown-package';

const CustomAttachment = (props) => {
    let arr = props.attachment.asset_url.split('/');
    const [uri, setUri] = useState(props.attachment.asset_url);
    const [downloadStatus, setDownloadStatus] = useState('');

    const {fs} = RNFetchBlob;
    const downloads = `${fs.dirs.DocumentDir}/${arr[arr.length - 1]}`;
    const configOptions = {
        fileCache: true,
        path: downloads,
        notification: true,
    };

    const checkFile = async () => {
        if (uri.indexOf('.3gp') > -1 && DeviceInfo.ios) {
            await RNFetchBlob.fs.stat(downloads.replace('.3gp', '.mp4')).then(file => {
                setUri(file.path);
                // RNFetchBlob.fs.unlink(file.path);
                setDownloadStatus('downloaded');
            });
        } else {
            setDownloadStatus('downloaded');
        }
    };

    useEffect(() => {
        checkFile();
    }, []);

    const filePress = async () => {
        let videoUri = uri;
        if (uri.indexOf('.3gp') > -1 && DeviceInfo.ios) {
            await RNFetchBlob.fs.stat(downloads.replace('.3gp', '.mp4')).then(file => {
                videoUri = file.path;
            }).catch(async () => {
                setDownloadStatus('downloading');
                await RNFetchBlob.config(configOptions).fetch('GET', uri).then(async (res) => {
                    await FFmpegKit.executeAsync(`-i ${res.data} -c:v  mpeg4 ${res.data.replace('.3gp', '.mp4')}`).then(() => {
                        setTimeout(() => {
                            videoUri = res.data.replace('.3gp', '.mp4');
                            setDownloadStatus('downloaded');
                            RNFetchBlob.fs.unlink(res.data);
                            setUri(videoUri);
                        }, 1000)
                    });
                }).catch((err) => {
                    console.log(err);
                    setDownloadStatus('');
                    setUri(videoUri);
                })
            });
            return
        }
        props.setVideoFile({
            "camera": true,
            "name": "1626958211967",
            "size": null,
            "type": "video",
            "uri": videoUri
        });
        setUri(videoUri);
        props.setModalVisible(true)
    };

    return (
        <TouchableWithoutFeedback
            onPress={filePress}
            delayLongPress={500}
            onLongPress={() => {
            }}
        >
            <View style={styles.backgroundVideo}>
                <Video
                    source={{uri: uri, cache: {expiresIn: 3600}}}
                    style={styles.backgroundVideo}
                    paused={true}
                    resizeMode={'cover'}
                    ignoreSilentSwitch={"ignore"}
                />
                <View style={styles.playIcon}>
                    {downloadStatus === 'downloaded' ? <PlayVideo width={sizes.size69} height={sizes.size69}/> : null}
                    {downloadStatus === '' ? <Image style={styles.downloadIcon}
                                                    source={require('../../assets/images/icons/download.png')}/> : null}
                    {downloadStatus === 'downloading' ? <View style={styles.downloadingIcon}>
                        <ActivityIndicator size={'small'} color={Colors.white}/>
                    </View> : null}
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};

const MessageCustomAvatar = () => {
    const [contact, setContact] = useState(null);
    const {lastGroupMessage, message} = useMessageContext();

    useEffect(() => {
        let contact = ContactsService.getContactByNumber(message?.user.orderedPhoneNumbers ? message.user?.orderedPhoneNumbers?.[0] : '');
        setContact(contact)
    }, []);

    return (
        !lastGroupMessage ? <View style={{
            width: sizes.size50,
            height: sizes.size42
        }}/> : contact && contact.imageUri ? <Image
            style={styles.userPhoto}
            resizeMode={'cover'}
            source={{uri: contact.imageUri}}
            onError={() => {
                setContact({
                    contact: {
                        ...contact,
                        imageUri: ''
                    }
                })
            }}
        /> : <View style={[styles.userPhoto, styles.defaultUserImageContainer]}>
            <Image
                style={styles.defaultUserImage}
                resizeMode={'cover'}
                source={require('../../assets/images/default-chat-user-image.png')}
            />
        </View>
    )
};

const MessageCustomFooter = (props) => {
    const {lastGroupMessage, message, isMyMessage} = useMessageContext();
    const [name, setName] = useState(null);

    useEffect(() => {
        let number = message?.user.orderedPhoneNumbers ? message.user?.orderedPhoneNumbers?.[0] : '';
        let contact = ContactsService.getContactByNumber(number);
        let name = '';
        let numberId = number;
        if (contact) {
            name = contact.givenName || contact.familyName ? `${contact.givenName ? contact.givenName + ' ' : ''}${contact.familyName ? contact.familyName : ''}` : `${ValidationService.parsePhoneNumber(numberId)}`;
        } else {
            name = ValidationService.parsePhoneNumber(numberId)
        }
        setName(name);
    }, []);

    const openErrorMessage = () => {
        Alert.alert(
            "Sorry your message cannot be delivered to this number.",
            ""
        );
    };

    return (
        props.channel.data.type === 'group' ? <View style={styles.messageFooterContent}>
            {
                props.propsData.isDeleted ? <MessageFooter {...props.propsData}/> : message.isSMSFailed ? <View>
                    {isMyMessage ? <View style={styles.messageFooterRow}>
                        <TouchableOpacity onPress={openErrorMessage}>
                            <Info width={sizes.size32} height={sizes.size32} color={Colors.wrong}/>
                        </TouchableOpacity>
                        <Text style={styles.messageFooterText}>
                            {props.propsData.formattedDate}
                        </Text>
                    </View> : null}
                </View> : lastGroupMessage ? <Text style={styles.messageFooterText}>
                    {props.propsData.formattedDate}
                </Text> : null
            }
        </View> : <View style={styles.messageFooterContent}>
            {
                props.propsData.isDeleted ? <MessageFooter {...props.propsData}/> : message.isSMSFailed ? <View>
                    {isMyMessage ? <View style={styles.messageFooterRow}>
                        <TouchableOpacity onPress={openErrorMessage}>
                            <Info width={sizes.size32} height={sizes.size32} color={Colors.wrong}/>
                        </TouchableOpacity>
                        <Text style={styles.messageFooterText}>
                            {props.propsData.formattedDate}
                        </Text>
                    </View> : null}
                </View> : lastGroupMessage ? <View>
                    {isMyMessage ? <View style={styles.messageFooterRow}>
                            <View>
                                <MessageStatus {...props.propsData}/>
                            </View>
                            <Text style={styles.messageFooterText}>
                                {props.propsData.formattedDate}
                            </Text>
                        </View>
                        : <Text style={[styles.messageFooterText, {color: Colors.grayDate}]}>
                            {props.propsData.formattedDate}
                        </Text>
                    }
                </View> : null
            }
        </View>
    )
};

const MessageCustomHeader = (props) => {
    const {lastGroupMessage, message, isMyMessage} = useMessageContext();
    const [name, setName] = useState(null);

    useEffect(() => {
        let number = message?.user.orderedPhoneNumbers ? message.user?.orderedPhoneNumbers?.[0] : '';
        let contact = ContactsService.getContactByNumber(number);
        let name = '';
        let numberId = number;
        if (contact) {
            name = contact.givenName || contact.familyName ? `${contact.givenName ? contact.givenName + ' ' : ''}${contact.familyName ? contact.familyName : ''}` : `${ValidationService.parsePhoneNumber(numberId)}`;
        } else {
            name = ValidationService.parsePhoneNumber(numberId)
        }
        setName(name);
    }, []);


    return (
        props.channel.data.type === 'group' ?
            <Text style={styles.messageHeaderText}>
                {!isMyMessage ? name : ''}
            </Text> : null
    )
};

const TypingCustomIndicator = () => {
    const [name, setName] = useState(null);
    const {typing} = useTypingContext();

    useEffect(() => {
        if (Object.keys(typing).length) {
            checkName(typing)
        }
    }, [() => {
        if (Object.keys(typing).length) {
            checkName(typing)
        }
    }]);

    const checkName = (typing) => {
        AsyncStorage.getItem('currentUser').then((user) => {
            user = JSON.parse(user);
            let arr = Object.keys(typing);
            arr = arr.filter(item=>typing[item].user?.orderedPhoneNumbers?.[0]!==user.orderedNumbers[0]);
            if(arr.length){
                if(arr.length<2){
                    let number = typing[arr[0]].user?.orderedPhoneNumbers?.[0];
                    let contact = ContactsService.getContactByNumber(number);
                    let name = '';
                    let numberId = number;
                    if (contact) {
                        name = contact.givenName || contact.familyName ? `${contact.givenName ? contact.givenName + ' ' : ''}${contact.familyName ? contact.familyName : ''}` : `${ValidationService.parsePhoneNumber(numberId)}`;
                    } else {
                        name = ValidationService.parsePhoneNumber(numberId)
                    }
                    setName(`${name} is typing`);
                } else if (arr.length > 2) {
                    setName('Multiple people are typing');
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
                    setName(`${name} are typing`);
                }
            }
        });
    };

    return (
        <View style={styles.typingTextContainer}>
            {name ? <Image style={styles.loadingGif} source={require('../../assets/images/typing.gif')}/> : null}
            <Text style={styles.typingText} numberOfLines={1} ellipsizeMode={'tail'}>{name}</Text>
        </View>
    )
};

const ChannelUI = (props) => {
    const {modalVisible, setModalVisible, videoFile, setVideoFile} = props;
    const [attachMenuOpened, setAttachMenuOpened] = useState(false);
    const dispatch = useDispatch();
    const {setChannel} = useContext(AppContext);
    const headerHeight = useHeaderHeight();
    const blockedNumbers = useSelector(store => store.UserInfoReducer.blockedNumbers);
    const {setTopInset} = useAttachmentPickerContext();
    let keyboardDidShowListener = null;
    let channel = null;

    if (props.activeChannel) {
        channel = props.activeChannel;

        if (!props.appContextNoChange) {
            setChannel(channel)
        }
    } else {
        channel = props.channel
    }

    const _keyboardDidShow = () => {
        setAttachMenuOpened(false)
    };

    const messageEventHandler = () => {
        if (props.showChanel) {
            props.showChanel()
        }
    };

    useEffect(() => {
        keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            _keyboardDidShow,
        );
        channel.on('message.new', messageEventHandler);
        dispatch(makeAction(SET_ACTIVE_CHAT_ID,channel.cid));
        dispatch(makeAction(GET_BADGES));
        setTopInset(headerHeight);
        return () => {
            dispatch(makeAction(SET_ACTIVE_CHAT_ID, ''));
            if (keyboardDidShowListener) {
                keyboardDidShowListener.remove();
            }
            // channel.off('message.new', messageEventHandler)
        }
    }, [headerHeight]);

    const call = async (number) => {
        props.setCallLoading(true);
        dispatch(makeAction(GENERATE_OUTGOING_CALL_NUMBER, {
            callback: async (data) => {
                await AlertService.call(data.imrn);
                props.setCallLoading(false);
            },
            error: () => {
                props.setCallLoading(false);

            },
            number: number
        }));
    };

    return (
        <SafeAreaView>
            <Chat client={ChatService.chatClient}>
                <Channel
                    myMessageTheme={makeTheme(true)}
                    channel={channel}
                    quotedReply={null}
                    threadReply={null}
                    keyboardVerticalOffset={headerHeight}
                    MessageAvatar={() => {
                        return MessageCustomAvatar()
                    }}
                    DateHeader={() => {
                        return (null)
                    }}
                    InlineDateSeparator={(props) => {
                        return (<Divider text={`${ValidationService.convertDateDivider(props.date)}`}/>)
                    }}
                    TypingIndicator={() => {
                        return TypingCustomIndicator()
                    }}
                    MessageHeader={(props) => {
                        return MessageCustomHeader({propsData: props, channel: channel})
                    }}
                    MessageFooter={(props) => {
                        return MessageCustomFooter({propsData: props, channel: channel})
                    }}
                    InputButtons={() => {
                        return (
                            <View style={{flexDirection: 'row'}}>
                                <View style={styles.attachButton}>
                                    <Attach width={sizes.size28} height={sizes.size27}
                                            color={attachMenuOpened ? Colors.messageLoader : null}/>
                                </View>
                                {channel.data.phoneNumbers.length < 3 ? <TouchableOpacity onPress={() => {
                                    AsyncStorage.getItem('currentUser').then((user) => {
                                        user = JSON.parse(user);
                                        channel.data.phoneNumbers.forEach((item) => {
                                            if (item !== user.orderedNumbers[0]) {
                                                call(item)
                                            }
                                        });
                                    })
                                }}>
                                    <ChatCall width={sizes.size38} height={sizes.size38}/>
                                </TouchableOpacity> : null}
                            </View>
                        )
                    }}
                    Attachment={(props) => {
                        const {message, lastGroupMessage } = useMessageContext();
                        return (
                            <View style={message.isSMSFailed ? [ styles.failedVideoWrapper, lastGroupMessage ? {borderBottomRightRadius: 0} : {} ] : {}}>
                                {
                                    props.attachment.type === "video" ?
                                        CustomAttachment({
                                            ...props,
                                            setModalVisible: setModalVisible,
                                            setVideoFile: setVideoFile
                                        })
                                        : props.attachment.mime_type === "video/mp4" || props.attachment.mime_type === "video/3gp" ?
                                        CustomAttachment({
                                            ...props,
                                            setModalVisible: setModalVisible,
                                            setVideoFile: setVideoFile
                                        })
                                        : FileAttachment({...props})
                                }
                            </View>
                        )

                    }}
                    Gallery={(props)=>{
                        const {message, lastGroupMessage } = useMessageContext();
                        return(
                            <View style={message.isSMSFailed ? [ styles.failedImageWrapper, lastGroupMessage ? {borderBottomRightRadius: 0} : {} ] : {}}>
                                {Gallery({...props})}
                            </View>
                        )
                    }}
                    MessageSimple={() => {
                        const {message} = useMessageContext();
                        // const visible = blockedNumbers.find((value) => {
                        //     return message.user?.orderedPhoneNumbers?.[0].includes(value.callsFrom)
                        // })
                        //
                        // return !visible ? MessageSimple() : null
                        return message.shadowed ?  null : MessageSimple()
                    }}
                    MessageContent={(props) => {
                        const {message, messageContentOrder, lastGroupMessage} = useMessageContext();
                        return (
                            message.isSMSFailed && messageContentOrder[0] === "text" ?
                                <View>
                                    <View style={[ styles.failedTextWrapper, lastGroupMessage ? {borderBottomRightRadius: 0} : {}] }>
                                        <View>
                                            <Markdown>
                                                {message.text}
                                            </Markdown>
                                        </View>
                                    </View>
                                    { MessageCustomFooter({propsData: props, channel} )}
                                </View>

                            : MessageContent({...props})
                        )
                    }}

                >
                    <View style={StyleSheet.absoluteFill}>
                        <MessageList/>
                        <MessageInput/>
                        {
                            attachMenuOpened ?
                            <AttachCustomButton
                                setAttachMenuOpened={setAttachMenuOpened}
                                isExistNotLinexUser={
                                    Object.entries(channel.state?.members).some(([key, value])=>{
                                        return !value?.isLinex && value.id !== channel._client._user.id
                                    })
                                }
                            />
                            : null
                        }
                    </View>
                </Channel>
            </Chat>
            <TouchableOpacity
                style={[styles.attachButtonPositioned, attachMenuOpened ? {bottom: DeviceInfo.ios && DeviceInfo.hasNotch ? sizes.size113 : sizes.size84} : null]}
                onPress={() => {
                    setAttachMenuOpened(!attachMenuOpened)
                }}/>
        </SafeAreaView>
    );
};

export default ChannelUI
