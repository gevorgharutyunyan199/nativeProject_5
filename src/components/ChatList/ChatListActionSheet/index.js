import React from 'react';
import {DeviceInfo} from "../../../assets/DeviceInfo";
import {ActionSheetIOS} from "react-native";
import {Colors} from "../../../assets/RootStyles";

const ChatListActionSheet = (tryAgain,deleteMessage,cancel) => {
    if (DeviceInfo.ios) {
        return (
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ["Try Again","Delete Message","Cancel"],
                    tintColor: Colors.appColor1,
                    destructiveButtonIndex: 1,
                    cancelButtonIndex: 2
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            tryAgain();
                            return;
                        case 1:
                            deleteMessage();
                            return;
                        case 2:
                            cancel();
                            return;
                    }
                }
            )
        )
    }
}
export {ChatListActionSheet}
