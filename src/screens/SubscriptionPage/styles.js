import {StyleSheet} from 'react-native';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';

export default StyleSheet.create({
    screen: {
        flex: 1,
    },
    contentContainer: {
      flex: 1
    },
    phoneNumberContainer: {
        width: sizes.size168,
        height: sizes.size42,
        borderRadius: sizes.size22p5,
        backgroundColor: Colors.white,
        marginLeft: sizes.size19,
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size10*DeviceInfo.deviceHeight/812:sizes.size10,
        marginBottom: DeviceInfo.deviceHeight/812<1?sizes.size40:sizes.size115,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyPhoneNumberContainer: {
        width: sizes.size168,
        height: sizes.size42,
        marginLeft: sizes.size19,
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size10*DeviceInfo.deviceHeight/812:sizes.size10,
        marginBottom: DeviceInfo.deviceHeight/812<1?sizes.size40:sizes.size115
    },
    phoneNumber: {
        fontFamily: fonts.regular,
        fontSize: sizes.size18,
        fontWeight: '600',
        color: Colors.appColorText
    },
    informRow: {
        marginHorizontal: sizes.size19,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: sizes.size10
    },
    informText: {
        fontFamily: fonts.regular,
        marginLeft: sizes.size9,
        fontSize: sizes.size14,
        color: Colors.white
    },
    footer: {
        height: DeviceInfo.deviceHeight/812<1?sizes.size300:sizes.size350,
        backgroundColor: Colors.white,
        borderTopLeftRadius: sizes.size12,
        borderTopRightRadius: sizes.size12,
        paddingTop: DeviceInfo.deviceHeight/812<1?sizes.size30*DeviceInfo.deviceHeight/812:sizes.size30,
        paddingBottom: DeviceInfo.deviceHeight/812<1?sizes.size32*DeviceInfo.deviceHeight/812:sizes.size32
    },
    boldText: {
        fontFamily: fonts.regular,
        fontSize:sizes.size20,
        fontWeight: '600',
        textAlign: 'center',
        color: Colors.black,
        marginBottom: DeviceInfo.deviceHeight/812<1?sizes.size20*DeviceInfo.deviceHeight/812:sizes.size20
    },
    freeTrialText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.grayText,
        marginBottom: DeviceInfo.deviceHeight/812<1?sizes.size40*DeviceInfo.deviceHeight/812:sizes.size50
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    restoreContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: DeviceInfo.deviceHeight/812<1?sizes.size40*DeviceInfo.deviceHeight/812:sizes.size59
    },
    restore: {
        fontFamily: fonts.regular,
        marginTop: sizes.size15,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.grayLinkText,
        textDecorationLine: "underline"
    },
    privacyPolicyContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkButton: {
        marginHorizontal: sizes.size21p5
    },
    privacyPolicyLink: {
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        color: Colors.grayText,
        textDecorationLine: "underline"
    },
    descText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.grayText,
        padding: sizes.size20
    }
});
