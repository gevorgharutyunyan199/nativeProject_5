import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.originalBlack,
        paddingTop: sizes.size72,
        paddingBottom: sizes.size30
    },
    imageVideo: {
        width: DeviceInfo.deviceWidth,
        height: DeviceInfo.deviceHeight-sizes.size102,
        borderTopLeftRadius: sizes.size12,
        borderTopRightRadius: sizes.size12,
    },
    contentContainer: {
        width: DeviceInfo.deviceWidth,
        height: DeviceInfo.deviceHeight-sizes.size102,
        borderTopLeftRadius: sizes.size12,
        borderTopRightRadius: sizes.size12,
        position: 'relative'
    },
    closeButton: {
        position: 'absolute',
        zIndex: 10,
        left: sizes.size16,
        top: sizes.size16
    },
    sendButton: {
        position: 'absolute',
        minWidth: sizes.size69,
        minHeight: sizes.size69,
        zIndex: 10,
        right: sizes.size16,
        bottom: sizes.size16,
        justifyContent:"center"
    },
    playButton: {
        position: 'absolute',
        zIndex: 10,
        right: (DeviceInfo.deviceWidth-sizes.size69)/2,
        top: (DeviceInfo.deviceHeight-sizes.size102-sizes.size69)/2
    },
    timerContainer: {  flexDirection: 'row',
        alignItems: 'center',
        marginRight: sizes.size18,
        width: sizes.size60,
        position: 'absolute',
        zIndex: 10,
        right: (DeviceInfo.deviceWidth-sizes.size100)/2,
        top: sizes.size23
    },
    timerText: {
        textAlign: 'center',
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        color: Colors.white
    },
    dot: {
        width: sizes.size7,
        height: sizes.size7,
        borderRadius: sizes.size3p5,
        marginRight: sizes.size11,
        backgroundColor: Colors.white
    },
    loaderContainer: {
        // position: 'absolute',
        top: sizes.size40,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
