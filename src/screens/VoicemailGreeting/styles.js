import {StyleSheet} from 'react-native';
import {Colors,fonts} from '../../assets/RootStyles';
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
    contentContainer: {
        marginTop: sizes.size8,
        flex: 1
    },
    itemContainer: {
        height: sizes.size52,
        paddingHorizontal: sizes.size8,
        backgroundColor: Colors.white
    },
    itemContentContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        flex: 1,
        flexDirection: 'row'
    },
    itemIconContainer: {
        width: sizes.size32
    },
    itemNameContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: sizes.size8
    },
    iconButton: {
        flex: 1,
        justifyContent: 'center'
    },
    itemName: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    createGreetingButton: {
        marginTop: sizes.size8,
        height: sizes.size52,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    createGreetingButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        fontWeight: '500',
        color: Colors.appColor1
    },
    createGreetingButtonTextAndroid: {
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        fontWeight: 'bold',
        color: Colors.cancel
    }
});
