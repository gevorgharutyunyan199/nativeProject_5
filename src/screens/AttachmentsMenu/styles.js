import {StyleSheet} from "react-native";
import {Colors, fonts} from "../../assets/RootStyles";
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerContainer: {
        paddingBottom: DeviceInfo.android?sizes.size16:0
    },
    tabsContainer: {
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        flexDirection: 'row',
        paddingHorizontal: sizes.size15,
    },
    tabText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: sizes.size52,
        paddingVertical: sizes.size15,
        borderBottomWidth: sizes.size5,
        borderColor: 'transparent'
    },
    activeTab: {
        borderBottomWidth: sizes.size3,
        borderColor: Colors.appColor1
    },
    mediaItem: {
        width: sizes.size110,
        height: sizes.size110
    },
    sectionTitleText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size18,
        fontWeight: DeviceInfo.ios?'500':'bold',
        color: Colors.black,
        margin: sizes.size7p5,
        marginTop: sizes.size16
    },
    linkItem: {
        backgroundColor: Colors.searchInputColor,
        margin: sizes.size5,
        borderRadius: sizes.size9,
        flexDirection: 'row',
        alignItems: 'center'
    },
    linkImage: {
        width: sizes.size110,
        height: sizes.size110
    },
    linkDescContainer: {
        marginLeft: sizes.size20
    },
    linkText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        fontWeight: DeviceInfo.ios?'500':'bold',
        color: Colors.black,
        marginVertical: sizes.size7p5,
    },
    link: {
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        color: Colors.grayText,
    },
    durationText: {
        position: 'absolute',
        fontFamily: fonts.regular,
        fontSize: sizes.size7,
        color: Colors.white,
        bottom: sizes.size10,
        right: sizes.size16
    },
    videoIconContainer: {
        position: 'absolute',
        fontFamily: fonts.regular,
        fontSize: sizes.size7,
        color: Colors.white,
        bottom: sizes.size9,
        left: sizes.size14
    },
    emptyListContainer: {
        height: DeviceInfo.deviceHeight-sizes.size280,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactsEmptyImgStyle: {
        width: sizes.size80p5,
        height: sizes.size110
    },
    voicemailsEmptyImgStyle: {
        width: sizes.size110,
        height: sizes.size110
    },
    itemBackground: {
        backgroundColor: Colors.grayImageBackground,
        margin: sizes.size7p5
    },
    emptyListText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.grayText,
        marginTop: sizes.size10
    },
    downloadIcon: {
        width: sizes.size50,
        height: sizes.size50
    },
    downloadingIcon: {
        margin: sizes.size6,
        width: sizes.size41,
        height: sizes.size41,
        borderRadius: sizes.size29,
        backgroundColor: Colors.blackOpacity,
        justifyContent: 'center',
        alignItems: 'center'
    },
    downloadIconContainer: {
        position: 'absolute',
        top: sizes.size28,
        left: sizes.size28
    }
});
