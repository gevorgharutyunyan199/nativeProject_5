import {StyleSheet} from 'react-native';
import {Colors} from '../../../assets/RootStyles';
import {sizes} from "../../../assets/sizes";
import {DeviceInfo} from "../../../assets/DeviceInfo";

export default StyleSheet.create({
    contentContainer: {
        flex: 1,
        marginVertical: sizes.size6,
        paddingHorizontal: sizes.size17,
        flexDirection: "row",
        alignItems: "flex-end"
    },
    senderContainerSmallMargin: {
        marginVertical: sizes.size2
    },
    justifyEnd: {
        justifyContent: "flex-end"
    },
    justifyStart: {
        justifyContent: "flex-start"
    },
    backgroundVideo: {
        width: sizes.size198,
        height: sizes.size258,
        zIndex: 1,
        borderRadius: sizes.size9
    },
    playButton: {
        position: 'absolute',
        zIndex: 1
    },
    videoContainer: {
        width: sizes.size198,
        height: sizes.size258,
        position: "relative",
        borderRadius: sizes.size9,
        alignItems: "center",
        justifyContent: "center",
        borderColor: Colors.inputBottomBorder,
        borderWidth: sizes.size1
    },
    statusError: {
        width: DeviceInfo.ios?sizes.size200p5:sizes.size200,
        height: sizes.size260,
        opacity: 0.5,
        borderColor: Colors.wrong,
        borderWidth: sizes.size1,
        borderRadius: DeviceInfo.ios?sizes.size9:sizes.size10
    },
    videoData: {
        position: "absolute",
        bottom: sizes.size5,
        right: sizes.size9,
        zIndex: 1,
        color: Colors.whiteOpacity,
        fontSize: sizes.size8
    },
    errorIcon: {
        width: sizes.size32,
        height: sizes.size32
    },
    loaderContainer: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: sizes.size9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.searchInputColor
    }
});
