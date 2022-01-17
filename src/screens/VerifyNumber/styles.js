import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from '../../assets/sizes';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    headerContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingBottom: DeviceInfo.android?sizes.size16:0,
        marginBottom: sizes.size20
    },
    footer: {
        marginBottom: sizes.size32,
        alignItems: 'center'
    },
    loaderFooter: {
        position: 'absolute',
        zIndex: 10,
        width: DeviceInfo.deviceWidth,
        height: sizes.size100,
        backgroundColor: Colors.screenLoaderBackground
    },
    grayText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        color: Colors.grayText,
        marginTop: sizes.size5,
        marginLeft: sizes.size20,
        marginRight: sizes.size65
    },
    inputsContainer: {
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size20:sizes.size40,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    inputContainerStyle: {
        height: sizes.size50,
        width: sizes.size45,
        borderBottomWidth: sizes.size2,
        borderColor: Colors.grayBorder,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: sizes.size7p5
    },
    input: {
        paddingVertical: 0,
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    clear: {
        marginLeft: sizes.size6,
        marginTop: sizes.size15,
        width: sizes.size30,
        height: sizes.size30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        marginTop: sizes.size13,
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.wrong,
        marginHorizontal: sizes.size20
    },
    resendContainer: {
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size20:sizes.size39,
        marginLeft:sizes.size20,
        flexDirection: 'row'
    },
    resendContainerError: {
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size10:sizes.size10,
    },
    resend: {
        textDecorationLine: 'underline',
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.cancel
    }
});
