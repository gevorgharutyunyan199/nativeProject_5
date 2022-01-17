import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.searchInputColor
    },
    headerContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingBottom: DeviceInfo.android?sizes.size16:0
    },
    itemBackground: {
        backgroundColor: Colors.white,
    },
    settingItemContainer: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: sizes.size10p5,
        marginHorizontal: sizes.size8,
        paddingHorizontal: sizes.size8,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    itemTextContainer: {
        flex: 1
    },
    itemText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    valueText: {
        color: Colors.grayText
    },
    arrowIconContainer: {
        justifyContent: 'center',
        height: sizes.size32,
        marginRight: sizes.size9,
    }
});
