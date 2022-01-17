import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    headerContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingBottom: DeviceInfo.android?sizes.size16:0
    },
    footer: {
        marginBottom: sizes.size32,
        alignItems: 'center'
    },
    form: {
        marginTop: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?0:sizes.size9,
        marginBottom: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?sizes.size8:sizes.size12
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?sizes.size10:DeviceInfo.deviceHeight/812<1?sizes.size15:sizes.size46,
        marginHorizontal: sizes.size17p5,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.inputBottomBorder,
    },
    numberInput: {
        paddingTop: 0,
        paddingBottom: DeviceInfo.deviceWidth/DeviceInfo.deviceHeight>0.5 && DeviceInfo.android?sizes.size10:DeviceInfo.deviceHeight/812<1?sizes.size15:sizes.size19,
        flex: 1,
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        color: Colors.black
    },
    showIcon: {
        width: sizes.size32,
        height: sizes.size20,
    },
    errorText: {
        marginHorizontal: sizes.size20,
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.wrong
    }
});
