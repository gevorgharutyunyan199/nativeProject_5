import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    searchInputContainer: {
        marginTop: sizes.size15,
        paddingBottom: sizes.size12,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    hiddenItemContainer: {
        height: sizes.size63,
        backgroundColor: Colors.white,
        alignItems: 'flex-end'
    },
    deleteButton: {
        backgroundColor: Colors.wrong,
        height: sizes.size63,
        width: sizes.size85,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size11,
        color: Colors.white
    },
    emptyListContainer: {
        height: DeviceInfo.deviceHeight-sizes.size280,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listEmptyImgStyle: {
        width: sizes.size110,
        height: sizes.size110
    },
    emptyListText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.grayText,
        marginTop: sizes.size10
    },
    itemContainer: {
        flexDirection: 'row',
        paddingLeft: sizes.size19,
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    userPhoto: {
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
    itemRightContainer: {
        flex: 1,
        height: sizes.size63,
        paddingVertical: sizes.size11,
        marginLeft: sizes.size12,
        marginRight: sizes.size8,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    itemUserNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemUserName:{
        width: DeviceInfo.deviceWidth-sizes.size150,
        fontFamily: fonts.regular,
        fontSize: sizes.size17p5,
        fontWeight: '500',
        color: Colors.black
    },
    lastMessageContainer: {
        width: DeviceInfo.deviceWidth-sizes.size150,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: sizes.size4
    },
    itemLastMessage: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13p5,
        color: Colors.grayLinkText
    },
    dateText: {
        marginRight: sizes.size8,
        fontFamily: fonts.regular,
        fontSize: sizes.size12p5,
        color: Colors.grayText
    },
    marker: {
        width: sizes.size7,
        height: sizes.size7,
        borderRadius: sizes.size3p5,
        marginHorizontal: sizes.size6,
        backgroundColor: Colors.appColor1
    },
    androidNewChatButton: {
        position: 'absolute',
        zIndex: 5,
        bottom: sizes.size22,
        right: sizes.size22
    }
});
