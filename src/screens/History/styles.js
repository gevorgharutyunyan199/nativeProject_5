import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {sizes} from "../../assets/sizes";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
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
    voicemailsEmptyImgStyle: {
        width: sizes.size110,
        height: sizes.size110
    },
    emptyListText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.grayText,
        marginTop: sizes.size10
    },
    listFooter: {
        width: DeviceInfo.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
