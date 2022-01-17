import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts, iconsColors} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    contentContainer: {
        borderBottomWidth: 0.3,
        borderColor: iconsColors.gray
    },
    container: {
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    tabButton: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: sizes.size15
    },
    itemText: {
        marginTop: sizes.size22,
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        fontWeight: DeviceInfo.ios?'500':'bold',
        color: Colors.grayText
    },
    activeColor: {
        color: Colors.cancel
    },
    barrSliderContainer: {
        paddingHorizontal: DeviceInfo.ios?sizes.size9:0
    },
    barrSlider: {
        width: DeviceInfo.ios?(DeviceInfo.deviceWidth-sizes.size18)/2:DeviceInfo.deviceWidth/2,
        height: sizes.size3,
        backgroundColor: Colors.appColor1
    },
    badge: {
        width: sizes.size25,
        height: sizes.size18,
        position: 'absolute',
        zIndex: 1,
        top: sizes.size24,
        right: sizes.size20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.wrong,
        borderRadius: sizes.size9
    },
    singleDigitNumberBadge: {
        width: sizes.size18,
        right: sizes.size23
    },
    badgeText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size10,
        color: Colors.white
    }
});
