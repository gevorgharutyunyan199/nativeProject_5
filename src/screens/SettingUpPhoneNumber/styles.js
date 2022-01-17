import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts, iconsColors} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center'
    },
    backgroundImage: {
        width: sizes.size294,
        height: sizes.size189,
        marginTop: sizes.size110
    },
    contentContainer: {
        position: 'absolute',
        zIndex: 5,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: DeviceInfo.deviceWidth
    },
    iconStyle: {
        width: sizes.size80,
        height: sizes.size80,
        marginTop: sizes.size219
    },
    iconContainer: {
        borderWidth: sizes.size5,
        borderRadius: sizes.size40,
        borderColor: iconsColors.appColor,
        width: sizes.size80,
        height: sizes.size80,
        marginTop: sizes.size219,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingGif: {
        width: sizes.size50,
        height: sizes.size10,
    },
    title: {
        fontFamily: fonts.regular,
        fontSize: sizes.size20,
        fontWeight: 'bold',
        color: Colors.black,
        marginTop: sizes.size35
    },
    description: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        color: Colors.grayText,
        textAlign: 'center',
        marginVertical: sizes.size20,
        marginHorizontal: sizes.size48
    },
    number: {
        fontFamily: fonts.regular,
        fontSize: sizes.size20,
        fontWeight: 'bold',
        color: Colors.cancel
    },
    wrong: {
        color: Colors.wrong
    },
    footer: {
        marginBottom: sizes.size34,
        alignItems: 'center'
    }
});
