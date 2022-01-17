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
    descText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        color: Colors.grayText,
        padding: sizes.size20
    },
    inputContainer: {
        height: sizes.size53,
        marginHorizontal: sizes.size20,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    input: {
        paddingVertical: 0,
        flex: 1
    },
    footer: {
        marginBottom: sizes.size32,
        alignItems: 'center'
    },
    errorText: {
        marginTop: sizes.size12,
        marginHorizontal: sizes.size20,
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.wrong
    }
});
