import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from '../../assets/sizes';
import {DeviceInfo} from '../../assets/DeviceInfo';

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    inputContainer: {
        marginBottom: sizes.size17
    },
    scrollContainer: {
        flex: 1,
        paddingBottom: sizes.size40
    },
    listFooter: {
        width: DeviceInfo.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyListContainer: {
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size250*DeviceInfo.deviceHeight/812:sizes.size250,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyListText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size19,
        color: Colors.grayText
    }
});
