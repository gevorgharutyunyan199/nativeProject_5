import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
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
        marginHorizontal: sizes.size20
    },
    form: {
        marginTop: sizes.size9,
        marginBottom: sizes.size12
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size15:sizes.size41,
        marginHorizontal: sizes.size20,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.inputBottomBorder,
    },
    numberInput: {
        paddingTop: 0,
        paddingBottom: DeviceInfo.deviceHeight/812<1?sizes.size15:sizes.size19,
        flex: 1,
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        color: Colors.black
    },
    showIcon: {
        width: sizes.size32,
        height: sizes.size32,
    },
    errorText: {
        marginHorizontal: sizes.size20,
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.wrong
    },
    forgotTextContainer: {
        flexDirection: 'row',
        marginLeft: sizes.size20,
        marginTop: sizes.size11,
    },
    forgotText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.linkColor,
        textDecorationLine: 'underline'
    }
});
