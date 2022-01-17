import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    contentContainer: {
        flex: 1
    },
    searchInputContainer: {
        marginTop: sizes.size15,
        paddingBottom: sizes.size12,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    emptyListContainer: {
        height: DeviceInfo.deviceHeight-sizes.size280,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactsEmptyImgStyle: {
        width: sizes.size80p5,
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
        marginHorizontal: sizes.size17p5,
        paddingVertical: sizes.size16,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    settingsLink: {
        textDecorationLine: 'underline',
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.cancel
    },
    listFooter: {
        width: DeviceInfo.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    syncingIndicator: {
        backgroundColor: Colors.activeBullet,
        paddingVertical: sizes.size7,
        position: 'absolute',
        zIndex: 10,
        top: sizes.size120,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    indicatorText: {
        fontFamily: fonts.regular,
        fontSize: sizes.sizes13,
        color: Colors.white
    }
});
