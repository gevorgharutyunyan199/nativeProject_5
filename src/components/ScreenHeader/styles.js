import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    buttonContainer: {
        justifyContent: 'flex-end',
        height: DeviceInfo.deviceHeight/812<1?sizes.size70:sizes.size88,
        paddingHorizontal: sizes.size9,
        paddingVertical: sizes.size7,
        marginBottom: sizes.size6
    },
    titleContainer: {
        paddingHorizontal: sizes.size20,
        marginBottom: sizes.size10
    },
    title: {
        fontFamily: fonts.regular,
        fontSize: sizes.size22,
        color: Colors.black,
        fontWeight: '500'
    },
    iconContainer: {
        width: sizes.size50
    }
});
