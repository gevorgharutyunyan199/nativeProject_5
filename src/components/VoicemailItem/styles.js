import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";

export default StyleSheet.create({
    itemContainer: {
        marginHorizontal: sizes.size11,
        paddingTop: sizes.size12,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
    },
    itemTopContainer: {
        height: sizes.size65
    },
    ovalContainer: {
        width: sizes.size7,
        height: sizes.size7,
    },
    oval: {
        width: sizes.size7,
        height: sizes.size7,
        backgroundColor: Colors.appColor1,
        borderRadius: sizes.size3p5
    },
    title: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        fontWeight: '500',
        color: Colors.black,
        marginLeft: sizes.size8
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    flexBetween: {
        justifyContent: 'space-between'
    },
    day: {
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.grayText,
        marginRight: sizes.size5
    },
    durationContainer: {
        marginTop: sizes.size6,
        paddingLeft: sizes.size14
    },
    durationText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.grayText
    },
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: sizes.size10
    },
    playerSec: {
        fontFamily: fonts.regular,
        fontSize: sizes.size10,
        color: Colors.grayText
    },
    progressBarrContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlsContainer: {
        marginTop: sizes.size8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlsItem: {
        marginHorizontal: sizes.size44p5,
        alignItems: 'center'
    },
    controlsItemTitle: {
        fontFamily: fonts.regular,
        fontSize: sizes.size8,
        marginTop: sizes.size5,
        color: Colors.grayLinkText
    },
    playerLoaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.size32,
        height: sizes.size32
    }
});
