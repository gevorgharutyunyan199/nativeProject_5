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
    itemsContainer: {
        backgroundColor: Colors.white,
    },
    itemContentContainer: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: DeviceInfo.ios?'space-between':'flex-start',
        alignItems: 'center',
        paddingVertical: sizes.size10p5,
        marginHorizontal: sizes.size8,
        paddingHorizontal: sizes.size8,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    itemTextContainer: DeviceInfo.ios?{
        flex: 1
    }:{marginRight: sizes.size15},
    itemText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    arrowIconContainer: {
        height: sizes.size32,
        marginRight: sizes.size9
    },
    bottomBlockContainer: {
        backgroundColor: Colors.white,
        flex: 1,
        marginTop: sizes.size8
    },
    rightTextContainer: {
        paddingVertical: sizes.size6,
        marginRight: sizes.size9
    },
    rightText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
    },
    Disabled: {
        color: Colors.wrong
    },
    'Not Specified': {
        color: Colors.inputBottomBorder
    },
    Enabled: {
        color: Colors.appColor1
    },
    settingsButtonContainer: {
        paddingVertical: sizes.size5,
        paddingLeft: sizes.size16,
        paddingRight: sizes.size77
    },
    grayText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.grayText
    },
    link: {
        color: Colors.black,
        textDecorationLine: 'underline'
    },
    versionTextContainer: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingBottom: DeviceInfo.ios && DeviceInfo.hasNotch?sizes.size32:sizes.size19
    },
    versionText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.grayText
    }
});
