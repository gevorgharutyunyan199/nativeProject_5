import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    headerContainer: {
        height: sizes.size32,
        marginTop: sizes.size50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleContainer: {
        flex: 1,
        alignItems: DeviceInfo.ios?'center':'flex-start'
    },
    titleText: {
        textAlign: 'center',
        fontFamily: fonts.regular,
        fontSize: sizes.size18,
        fontWeight: DeviceInfo.ios?'500':'bold',
        color: Colors.black
    },
    buttonContainerRight: {
        alignItems: 'flex-end',
        paddingRight: sizes.size9,
        width: DeviceInfo.android?sizes.size85:sizes.size75
    },
    buttonContainerLeft: {
        alignItems: 'flex-start',
        paddingLeft: sizes.size9,
        width: sizes.size75
    },
    buttonContainerLeftAndroid: {
        width: 0,
        paddingLeft: sizes.size20,
    },
    linkButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.cancel
    },
    linkButtonTextAndroid: {
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        fontWeight: 'bold',
        color: Colors.cancel
    },
    marginRight7: {
        marginRight: sizes.size7,
    },
    marginLeft7: {
        marginLeft: sizes.size7,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelText: {
        textAlign: 'center',
        fontFamily: fonts.regular,
        fontSize: sizes.size11,
        fontWeight: '500',
        color: Colors.grayText,
        marginBottom: sizes.size7
    }
});
