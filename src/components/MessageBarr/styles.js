import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: sizes.size13,
        paddingLeft: sizes.size12,
        paddingRight: sizes.size15,
        borderTopWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        marginBottom: DeviceInfo.ios && DeviceInfo.hasNotch?sizes.size20:0,
        alignItems: 'center'
    },
    iconContainer: {
        marginRight: sizes.size22
    },
    inputContainer: {
        height: sizes.size50,
        borderWidth: sizes.size1,
        flex: 1,
        borderColor: Colors.grayBorder,
        borderRadius: sizes.size25,
        paddingHorizontal: sizes.size17,
        marginRight: sizes.size14,
        justifyContent: 'center'
    }
});
