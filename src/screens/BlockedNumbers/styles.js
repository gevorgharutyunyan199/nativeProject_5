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
        borderColor: Colors.grayBorder
    },
    searchInputContainer: {
        marginTop: sizes.size15,
        marginBottom: sizes.size11,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: sizes.size17p5,
        paddingVertical: sizes.size16,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    itemText: {
        flex: 1,
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    contentContainer: {
        flex: 1,
    },
    contentBottomPadding: {
        paddingBottom: sizes.size40
    },
    listFooter: {
        width: DeviceInfo.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyListContainer: {
        height: DeviceInfo.deviceHeight-sizes.size280,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactsEmptyImgStyle: {
        width: sizes.size110,
        height: sizes.size110
    },
    emptyListText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.grayText,
        marginTop: sizes.size10
    },
    unblockButton: {
        paddingVertical: sizes.size6,
        paddingHorizontal: sizes.size12,
        borderRadius: sizes.size18,
        borderWidth: sizes.size2,
        borderColor: Colors.grayBorder
    },
    unBlockButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        fontWeight: '500',
        color: Colors.cancel
    }
});
