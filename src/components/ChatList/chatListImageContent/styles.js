import {StyleSheet} from 'react-native';
import {sizes} from "../../../assets/sizes";
import {Colors} from "../../../assets/RootStyles";

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
    statusError: {
        opacity: 0.5,
        borderColor: Colors.wrong,
        borderWidth: sizes.size1,
        borderRadius: sizes.size9
    },
    imageContainerBlock: {
        width: sizes.size198,
        height: sizes.size258,
        position: "relative",
        borderRadius: sizes.size9
    },
    errorIcon: {
        width: sizes.size32,
        height: sizes.size32
    },
    imageContent: {
        position: 'absolute',
        zIndex: 100,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: sizes.size9,
        borderWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    imageData: {
        position: "absolute",
        bottom: sizes.size5,
        right: sizes.size9,
        zIndex: 101,
        color: Colors.whiteOpacity,
        fontSize: sizes.size8
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
