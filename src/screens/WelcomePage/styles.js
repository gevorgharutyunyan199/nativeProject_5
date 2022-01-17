import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors,fonts} from '../../assets/RootStyles';
import {DeviceInfo} from '../../assets/DeviceInfo';

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    contentContainer: {
        flex: 1,
        width: DeviceInfo.deviceWidth,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    footer: {
        marginBottom: sizes.size32,
        alignItems: 'center'
    },
    versionText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.gray
    },
    signInContainer: {
        marginBottom: sizes.size3,
        flexDirection: 'row'
    },
    accountText: {
        paddingBottom: sizes.size5,
        paddingTop: sizes.size10,
        paddingLeft: sizes.size10,
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.gray,
    },
    signInButton: {
        paddingBottom: sizes.size5,
        paddingTop: sizes.size10,
        paddingRight: sizes.size10,
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.black,
        textDecorationLine: "underline"
    },
    buttonContainer: {
        marginBottom: sizes.size8,
        marginTop: sizes.size17,
    },
    boldTextContainer: {
        marginBottom: sizes.size18,
        marginTop: sizes.size38
    },
    boldText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size22,
        color: Colors.black,
        fontWeight: '600'
    },
    descriptionContainer: {
        minHeight: sizes.size70,
        marginBottom: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?sizes.size120:DeviceInfo.deviceHeight/812<1?sizes.size120:sizes.size230
    },
    descriptionText: {
        fontFamily: fonts.regular,
        marginBottom: sizes.size8,
        textAlign: 'center',
        fontSize: sizes.size15,
        marginHorizontal: sizes.size39p5,
        color: Colors.gray
    },
    logo: {
        width: sizes.size156,
        height: sizes.size48
    }
});
