import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    buttonStyle: {
        width: sizes.size250,
        height: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?sizes.size40:sizes.size50,
        borderRadius: sizes.size25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: fonts.regular,
        color: Colors.white,
        fontSize: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?sizes.size14:sizes.size16
    },
    buttonTextInactive: {
        color: Colors.inactiveButtonText
    }
});
