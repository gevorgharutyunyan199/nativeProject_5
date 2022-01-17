import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts, iconsColors} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    contentContainer: {
        height: DeviceInfo.ios && DeviceInfo.hasNotch?sizes.size83:sizes.size54,
        backgroundColor: Colors.white,
        borderTopWidth: 0.3,
        borderColor: iconsColors.gray,
        flexDirection: 'row',
        paddingBottom: DeviceInfo.ios && DeviceInfo.hasNotch?sizes.size34:sizes.size5
    },
    button: {
        position: 'relative',
        width: sizes.size75
    },
    badge: {
        width: sizes.size25,
        height: sizes.size18,
        position: 'absolute',
        zIndex: 1,
        top: sizes.size2,
        right: sizes.size9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.wrong,
        borderRadius: sizes.size9
    },
    singleDigitNumberBadge: {
        width: sizes.size18,
        right: sizes.size13
    },
    badgeText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size10,
        color: Colors.white
    }
});
