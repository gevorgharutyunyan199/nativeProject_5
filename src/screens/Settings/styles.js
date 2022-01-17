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
    arrowIconContainer: {
        height: sizes.size32,
        marginRight: sizes.size9,
    },
    signOutButton: {
        marginTop: sizes.size8,
        paddingVertical: sizes.size16,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        marginBottom: sizes.size20
    },
    signOutText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.wrong
    },
    signOutTextAndroid: {
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        fontWeight: 'bold',
        color: Colors.wrong
    },
    phoneNumber: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        fontWeight: '500',
        color: Colors.grayText
    },
    centreAlignContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemMarginBottom: {
        marginBottom: sizes.size8
    }
});
