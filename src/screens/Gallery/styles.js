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
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    albumsItem: {
        height: sizes.size100,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        padding: sizes.size5
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    imageStyle: {
        width: sizes.size90,
        height: sizes.size90,
    },
    albumInfoContainer: {
        flex: 1,
        marginHorizontal: sizes.size5,
        justifyContent: 'center'
    },
    albumInfoTitleText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    count: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13p5,
        color: Colors.grayLinkText
    },
    arrowIconContainer: {
        justifyContent: 'center',
        marginRight: sizes.size5
    },
    imageBackground: {
        margin: sizes.size1p875,
        width: sizes.size90,
        height: sizes.size90,
        resizeMode: "cover",
        justifyContent: "flex-end",
        alignItems: 'flex-end'
    },
    videoDuration: {
        fontFamily: fonts.regular,
        fontSize: sizes.size9,
        color: Colors.white,
        margin: sizes.size2
    },
    errorContainer: {
        height: sizes.size52,
        position: 'absolute',
        zIndex: 10,
        left: sizes.size5,
        right: sizes.size5,
        top: sizes.size46,
        backgroundColor: Colors.black,
        borderRadius: sizes.size7,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.white
    },
    listFooter: {
        width: DeviceInfo.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
