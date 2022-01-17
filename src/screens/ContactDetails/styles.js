import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.searchInputColor
    },
    headerContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingBottom: DeviceInfo.android?sizes.size16:0
    },
    defaultUserImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultUserImage: {
        width: sizes.size41,
        height: sizes.size45
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: sizes.size30
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
        borderColor: Colors.grayBorder
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
    androidMenu: {
        flex: 1,
        alignItems: 'flex-end'
    },
    menuButton: {
        width: sizes.size155,
        height: sizes.size50,
        backgroundColor: Colors.white,
        marginRight: sizes.size6,
        shadowColor: Colors.black,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: sizes.size22
    },
    menuButtonMarginTop: {
        marginTop: sizes.size50,
    },
    menuButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black,
        marginLeft: sizes.size10
    },
    androidButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
