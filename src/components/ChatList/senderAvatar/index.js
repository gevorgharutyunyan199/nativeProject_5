import {Image, View} from "react-native";
import styles from "./styles";
import React from "react";

const SenderAvatar = ({isUser, item, contact}) => {

    return (
        <>
            {!isUser(item.from)?<View style={styles.userImageContainer}>
                <Image
                    source={contact && contact.imageUri?{url: contact && contact.imageUri}:require('../../../assets/images/default-chat-user-image.png')}
                    resizeMode={contact && contact.imageUri?'cover':'contain'}
                    style={[
                        styles.userImage,
                        contact && contact.imageUri?styles.senderUserImage:null
                    ]}
                />
            </View>:null}
        </>
    )
}

export {SenderAvatar}
