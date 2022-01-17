import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.originalBlack,
        paddingTop: sizes.size72,
    },
    camera: {
        flex: 1
    },
    preview: {
        flex: 1,
        borderTopLeftRadius: sizes.size12,
        borderTopRightRadius: sizes.size12,
        overflow: 'hidden'
    },
    videoImageSelectorContainer: {
        top: sizes.size13,
        flexDirection: 'row',
        position: 'absolute',
        zIndex: 10,
        width: sizes.size150
    },
    selector: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.5
    },
    footer: {
        position: 'absolute',
        height: sizes.size119,
        zIndex: 5,
        bottom: 0,
        width: DeviceInfo.deviceWidth
    },
    footerContentContainer: {
        height: sizes.size119,
    },
    lineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        height: sizes.size4,
        width: sizes.size65,
        backgroundColor: Colors.cancel
    },
    activeText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.cancel
    },
    inactiveText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.white
    },
    cameraRevertButton: {
        position: 'absolute',
        zIndex: 10,
        top: sizes.size24,
        right: sizes.size22
    },
    takePhotoButton: {
        position: 'absolute',
        zIndex: 10,
        bottom: sizes.size135,
        left: (DeviceInfo.deviceWidth-sizes.size69)/2
    },
    closeButton: {
        position: 'absolute',
        zIndex: 10,
        left: sizes.size16,
        top: sizes.size88
    },
    timerContainer: {
        minWidth: sizes.size60,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: sizes.size18,
        position: 'absolute',
        zIndex: 10,
        right: (DeviceInfo.deviceWidth-sizes.size100)/2,
        top: sizes.size95
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
    }
});
