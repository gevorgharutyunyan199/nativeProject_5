import {StyleSheet} from "react-native";
import {sizes} from "../../assets/sizes";
import {Colors, fonts} from "../../assets/RootStyles";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    userPhoto: {
        marginRight: sizes.size8,
        width: sizes.size42,
        height: sizes.size42,
        borderWidth: sizes.size1,
        borderRadius: sizes.size45,
        borderColor: Colors.grayBorder
    },
    defaultUserImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultUserImage: {
        width: sizes.size17,
        height: sizes.size23
    },
    typingTextContainer: {
        marginLeft: sizes.size5,
        alignItems: 'center',
        flexDirection: 'row'
    },
    typingText: {
        fontSize: sizes.size14,
        fontFamily: fonts.regular,
        color: Colors.grayText,
        marginLeft: sizes.size5,
        marginBottom: sizes.size5,
        maxWidth: sizes.size300
    },
    loadingGif: {
        width: sizes.size30,
        height: sizes.size7,
        marginBottom: sizes.size5,
    },
    messageFooterContent: {
        position: "relative",
        alignSelf: 'flex-end'
    },
    messageFooterText: {
        fontSize: 8,
        color: Colors.whiteOpacity,
        position: 'absolute',
        top: -15,
        right: 9
    },
    messageHeaderText: {
        color: Colors.grayDate,
        fontSize: 8,
    },
    attachButton: {
        marginRight: sizes.size12,
        paddingTop: sizes.size6,
        paddingLeft: sizes.size6
    },
    attachButtonPositioned: {
        width: sizes.size30,
        height: sizes.size30,
        position: 'absolute',
        bottom: DeviceInfo.ios && DeviceInfo.hasNotch?sizes.size54:sizes.size25,
        left: 15
    },
    backgroundVideo: {
        width: 243,
        height: 190,
        borderRadius: 10,
        backgroundColor: Colors.grayImageBackground,
    },
    playIcon: {
        position: 'absolute',
        left: 121.5 - (sizes.size69/2),
        top: 95 - (sizes.size69/2)
    },
    messageFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    downloadIcon: {
        width: sizes.size69,
        height: sizes.size69
    },
    downloadingIcon: {
        margin: sizes.size6,
        width: sizes.size58,
        height: sizes.size58,
        borderRadius: sizes.size29,
        backgroundColor: Colors.blackOpacity,
        justifyContent: 'center',
        alignItems: 'center'
    },
    failedVideoWrapper: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10
    },
    failedImageWrapper: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 16
    },
    failedTextWrapper: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 16,
        minHeight: 44,
        padding: 10,
        marginTop: 4,
        backgroundColor: Colors.messageBubble1,
    }
});
