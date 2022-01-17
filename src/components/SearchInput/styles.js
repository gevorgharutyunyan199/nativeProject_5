import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {Colors, fonts} from '../../assets/RootStyles';

export default StyleSheet.create({
    container: {
        width: DeviceInfo.deviceWidth-2*sizes.size10,
        flexDirection: 'row',
        alignItems: 'center',
        height: sizes.size36,
        backgroundColor: Colors.searchInputColor,
        paddingHorizontal: sizes.size2,
        borderRadius: 8
    },
    input: {
        fontFamily: fonts.regular,
        flex: 1,
        fontSize: sizes.size16,
        paddingVertical: 0
    },
    contentContainer: {
        marginHorizontal: sizes.size10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerWidthShowKeyboard: {
        width: (DeviceInfo.deviceWidth-2*sizes.size10)-sizes.size69,
    },
    cancel: {
        width: sizes.size52,
        marginHorizontal: sizes.size8p5,
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        color: Colors.cancel
    }
});
