import {StyleSheet} from 'react-native';
import {Colors} from '../../../assets/RootStyles';
import {sizes} from "../../../assets/sizes";

export default StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    userContainer: {
        marginLeft: "auto",
    },
    senderContainer: {
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: sizes.size16,
        marginVertical: sizes.size6
    },
    senderContainerSmallMargin: {
        marginVertical: sizes.size2
    },
    senderContainerItem: {
        borderRadius: sizes.size10
    },
    messageContentContainer: {
        borderRadius: sizes.size10,
        flexDirection: 'row',
        maxWidth: sizes.size238,
        flexWrap: 'wrap'
    },
    message: {
        padding: sizes.size10,
        fontSize: sizes.size16,
        color: Colors.black
    },
    dataContainer: {
        paddingBottom: sizes.size5,
        paddingRight: sizes.size5,
        flexDirection: "row",
        alignItems: "flex-end"
    },
    data: {
        minWidth: sizes.size35,
        height: 0,
        textAlign: 'center',
        fontSize: sizes.size8,
        marginLeft: "auto"
    },
    dateTextStyle: {
        position: 'absolute',
        right: sizes.size5,
        bottom: sizes.size5,
        textAlign: 'center',
        fontSize: sizes.size8,
        marginLeft: "auto"
    },
    messageContainerError: {
        borderWidth: sizes.size1,
        borderColor: Colors.wrong,
        opacity: 0.7,
        backgroundColor: Colors.searchInputColor
    },
    errorIcon: {
        width: sizes.size32,
        height: sizes.size32
    }
});
