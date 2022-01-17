import {StyleSheet} from "react-native";
import {Colors, fonts} from "../../assets/RootStyles";
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.searchInputColor
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingBottom: DeviceInfo.android?sizes.size16:0
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: sizes.size30
    },
    defaultUserImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultUserImage: {
        width: sizes.size41,
        height: sizes.size45
    },
    userPhoto: {
        width: sizes.size110,
        height: sizes.size110,
        borderWidth: sizes.size3,
        borderRadius: sizes.size60,
        borderColor: Colors.appColor1
    },
    userNameContainer: {
        marginTop: sizes.size16,
        marginBottom: sizes.size30,
        alignItems: 'center'
    },
    userName: {
        fontFamily: fonts.regular,
        fontSize: sizes.size20,
        fontWeight: '500',
        textAlign: 'center',
        color: Colors.black,
        marginHorizontal: sizes.size14
    },
    mediaButton: {
        marginHorizontal: sizes.size5,
        marginBottom: sizes.size15,
        borderRadius: sizes.size9,
        paddingHorizontal: sizes.size12,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: sizes.size15,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    mediaButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    blockContainer: {
        marginHorizontal: sizes.size5,
        marginBottom: sizes.size15,
        borderRadius: sizes.size9,
        paddingHorizontal: sizes.size12,
        backgroundColor: Colors.white
    },
    phoneNumberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: sizes.size15,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        minHeight: sizes.size80
    },
    labelText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        color: Colors.black,
        marginBottom: sizes.size11
    },
    itemText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size18,
        color: Colors.activeBullet
    },
    rowContainer: {
        flexDirection: 'row'
    },
    contactCallButton: {
        marginLeft: sizes.size16
    },
    actionButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.wrong
    },
    groupChatItemName: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        color: Colors.black,
        marginBottom: sizes.size11
    },
    participants: {
        marginHorizontal: sizes.size20,
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        fontWeight: '500',
        color: Colors.black,
        marginBottom: sizes.size12
    }
});
