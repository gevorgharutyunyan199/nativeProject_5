import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {ChatListActionSheet, SenderAvatar} from "../../../components";
import {Colors,iconsColors} from "../../../assets/RootStyles";
import {DeviceInfo} from "../../../assets/DeviceInfo";

const ChatListMessageContent = ({item, isUser,convertDate, contact, tryAgain, deleteMessage, openAndroidActionModal, setActionModalSelectedItem, smallMargin}) => {

    const getSpace = ()=>{
        let str = '';
        for(let i = 0; i < convertDate(new Date(item.createdDate)).length; i++){
            str = str + ' ';
        }
        return str
    };

    return (
        <View style={styles.contentContainer}>
            <View style={[styles.senderContainer, isUser(item.from)?styles.userContainer:null, smallMargin?styles.senderContainerSmallMargin:{}]}>
                <SenderAvatar contact={contact} isUser={isUser} item={item}/>
                {isUser(item.from) && !item.isSent?<TouchableOpacity
                        onPress={() => {
                            if(DeviceInfo.ios){
                                ChatListActionSheet(tryAgain,deleteMessage,() => {})
                            }else {
                                setActionModalSelectedItem(item);
                                openAndroidActionModal()
                            }
                        }}
                    >
                        <Image style={styles.errorIcon} source={require('../../../assets/images/error-messages.png')}/>
                </TouchableOpacity>:null}
                <View
                    style={[
                        styles.messageContentContainer,
                        isUser(item.from)?{backgroundColor:iconsColors.appColor}:{backgroundColor: Colors.searchInputColor},
                        isUser(item.from) && !item.isSent?styles.messageContainerError:null
                    ]}
                >
                    <View>
                        <Text
                            style={[
                                styles.message,
                                isUser(item.from)?{color: Colors.white}:{color: Colors.black},
                                isUser(item.from) && !item.isSent?{color: Colors.grayText}:null
                            ]}
                            selectable={true}
                        >
                            {item.content}
                        </Text>
                    </View>
                    <View style={styles.dataContainer}>
                        <Text
                            style={[
                                styles.data,
                                isUser(item.from)?{color: Colors.whiteOpacity}:{color: Colors.placeholderTextColor},
                                isUser(item.from) && !item.isSent?{color: Colors.placeholderTextColor}:null
                            ]}
                        >
                            {getSpace()}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.dateTextStyle,
                            isUser(item.from)?{color: Colors.whiteOpacity}:{color: Colors.placeholderTextColor},
                            isUser(item.from) && !item.isSent?{color: Colors.placeholderTextColor}:null
                        ]}
                    >
                        {convertDate(new Date(item.createdDate))}
                    </Text>
                </View>
            </View>
        </View>
    )
};

export {ChatListMessageContent}
