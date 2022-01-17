import {StyleSheet} from 'react-native';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {sizes} from "../../assets/sizes";
import {Colors, fonts} from "../../assets/RootStyles";

export default StyleSheet.create({
    content: {
        flex: 1
    },
    listFooter: {
        width: DeviceInfo.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyListContainer: {
        height: DeviceInfo.deviceHeight-sizes.size175,
        justifyContent: 'center',
        alignItems: 'center'
    },
    androidMenu: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: Colors.blackOpacity4
    },
    bottomSheetContainer: {
        borderTopRightRadius: sizes.size20,
        borderTopLeftRadius: sizes.size20,
        backgroundColor: Colors.white,
        paddingHorizontal: sizes.size20
    },
    button: {
        height: sizes.size77,
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size18,
        color: Colors.black
    },
    bottomSheetHeader: {
        marginHorizontal: sizes.size12
    },
    lineContainer: {
        paddingTop: sizes.size16,
        alignItems: 'center'
    },
    line: {
        width: sizes.size40,
        height: sizes.size4,
        borderRadius: sizes.size2,
        backgroundColor: Colors.lineColor
    }
});
