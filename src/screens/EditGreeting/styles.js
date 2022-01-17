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
    startRecordingButton: {
        marginTop: sizes.size8,
        height: sizes.size52,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    startRecordingButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        fontWeight: '500',
        color: Colors.appColor1
    },
    startRecordingButtonTextAndroid: {
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        fontWeight: 'bold'
    },
    contentContainer: {
        height: sizes.size125,
        marginTop: sizes.size8,
        backgroundColor: Colors.white
    },
    progressBarrContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: sizes.size4p5,
        marginRight: sizes.size10
    },
    inputContainer: {
        height: sizes.size53,
        marginHorizontal: sizes.size20,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    input: {
        paddingVertical: 0,
        flex: 1
    },
    playerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    playButton: {
        marginLeft: sizes.size16p5
    },
    durationText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size10,
        color: Colors.grayText
    }
});
