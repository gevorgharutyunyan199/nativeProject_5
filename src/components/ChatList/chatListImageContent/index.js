import React, {useState} from 'react';
import {Text, View, Image, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Modal} from 'react-native';
import styles from './styles';
import {SenderAvatar} from "../senderAvatar";
import {ChatListActionSheet} from "../ChatListActionSheet";
import {Colors} from "../../../assets/RootStyles";
import FastImage from 'react-native-fast-image';
import {Preview} from "../../../components";
import {DeviceInfo} from "../../../assets/DeviceInfo";

const ChatListImageContent = ({item, isUser,convertDate, contact, tryAgain, deleteMessage, openAndroidActionModal, setActionModalSelectedItem, smallMargin}) => {

    const [modalVisible, setModalVisible] = useState(false);

    let file = {
        camera: true,
        name: new Date().getTime(),
        size: null,
        type: "image",
        uri: item.content?item.content:''
    };

    const hideModal = ()=>{
        setModalVisible(false)
    };

    return (
        <View style={[
            styles.contentContainer,
            isUser(item.from)?styles.justifyEnd:styles.justifyStart,
            isUser(item.from) && !item.isSent?{alignItems: 'center'}:null,
            smallMargin?styles.senderContainerSmallMargin:null
        ]}>
            <SenderAvatar isUser={isUser} item={item} contact={contact}/>
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
            <TouchableWithoutFeedback onPress={()=>{setModalVisible(true)}}>
                <View style={[styles.imageContainerBlock,isUser(item.from) && !item.isSent?styles.statusError:null]}>
                    <FastImage
                        source={{uri: item.content?item.content:''}}
                        resizeMode={FastImage.resizeMode.cover}
                        style={styles.imageContent}
                    />
                    <View style={[styles.loaderContainer]}>
                        <ActivityIndicator size={'small'} color={Colors.white}/>
                    </View>
                    <Text style={styles.imageData}>{convertDate(new Date(item.createdDate))}</Text>
                </View>
            </TouchableWithoutFeedback>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
            >
                <Preview
                    file={file}
                    hideModal={hideModal}
                    onlyShow={true}
                />
            </Modal>
        </View>
    )
};

export {ChatListImageContent};

