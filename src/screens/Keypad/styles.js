import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    topContainer: {
        paddingTop: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?sizes.size30:DeviceInfo.deviceHeight/812<1?0:sizes.size40,
        height: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?0:DeviceInfo.deviceHeight/812<1?sizes.size124:sizes.size230,
        marginHorizontal: sizes.size16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    keypadContainer: {
        flex: 1,
        marginTop: DeviceInfo.android?sizes.size128:0
    },
    imageBackground: {
        width: DeviceInfo.deviceWidth,
        height: sizes.size372,
        resizeMode: "cover"
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: sizes.size123,
        height: sizes.size95,
        margin: sizes.size1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textNumber: {
        fontFamily: fonts.regular,
        fontSize: sizes.size35,
        color: Colors.black
    },
    numberDesc: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        fontWeight: '600',
        color: Colors.grayText

    },
    number: {
        marginTop: DeviceInfo.android?sizes.size128:0,
        textAlign: 'center',
        fontFamily: fonts.regular,
        fontSize: sizes.size38,
        fontWeight: '300',
        color: Colors.black
    },
    numberMedium: {
        fontSize: sizes.size32,
    },
    numberSmall: {
        fontSize: sizes.size28,
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemImage: {
        width: sizes.size73,
        height: sizes.size73,
        marginHorizontal: sizes.size14,
        marginVertical: sizes.size8p5,
    },
    removeButton: {
        padding: sizes.size20,
        position: 'absolute',
        zIndex: 10,
        right: sizes.size29
    },
    remove: {
        width: sizes.size32,
        height: sizes.size32,
    },
    callLoaderContainer: {
        width: sizes.size73,
        height: sizes.size73,
        marginVertical: sizes.size8p5,
        backgroundColor: Colors.appColor1,
        borderRadius: sizes.size36p5,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
