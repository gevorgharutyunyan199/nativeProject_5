import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from '../../assets/sizes';
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    footer: {
        marginBottom: sizes.size32,
        alignItems: 'center'
    },
    loaderFooter: {
        position: 'absolute',
        zIndex: 10,
        width: DeviceInfo.deviceWidth,
        height: sizes.size100,
        backgroundColor: Colors.screenLoaderBackground
    },
    grayText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        color: Colors.grayText,
        marginTop: sizes.size5,
        marginLeft: sizes.size20
    },
    inputsContainer: {
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size20:sizes.size89,
        marginLeft: sizes.size40,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    inputContainerStyle: {
        height: sizes.size50,
        width: sizes.size45,
        borderBottomWidth: sizes.size2,
        borderColor: Colors.grayBorder,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: sizes.size7p5
    },
    input: {
        marginBottom: sizes.size8,
        fontFamily: fonts.regular,
        fontSize: sizes.size23,
        fontWeight: '600',
        color: Colors.cancel,
        paddingVertical: 0
    },
    clear: {
        marginLeft: sizes.size6,
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size10:sizes.size15,
        width: sizes.size30,
        height: sizes.size30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        marginTop: sizes.size10,
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.wrong,
        textAlign: 'center'
    },
    recommendationText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        textAlign: 'center',
        color: Colors.grayText,
        marginTop: sizes.size10,
        marginHorizontal: sizes.size33
    },
    recommendationsRow: {
        marginTop: DeviceInfo.deviceHeight/812<1?sizes.size15:sizes.size35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: sizes.size20
    },
    recommendationButton: {
        width: sizes.size63,
        height: sizes.size37,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: sizes.size18p5,
        backgroundColor: Colors.searchInputColor,
        marginHorizontal: sizes.size3p5
    },
    recommendationButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15p5,
        fontWeight: '600',
        color: Colors.cancel
    }
});
