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
    buttonContainer: {
        height: sizes.size50,
        paddingVertical: sizes.size10,
        paddingHorizontal: sizes.size20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    buttonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    textTonesText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.activeBullet,
        marginHorizontal: sizes.size20,
        marginTop: sizes.size35,
        marginBottom: sizes.size9
    }
});
