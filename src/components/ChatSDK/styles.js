import {StyleSheet} from "react-native";
import {sizes} from "../../assets/sizes";
import {Colors, fonts} from "../../assets/RootStyles";

export default StyleSheet.create({
    previewContainer: {
        backgroundColor: Colors.white,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: Colors.grayBorder,
        borderBottomWidth: sizes.size1,
        padding: sizes.size10,
    },
    previewTitle: {
        textAlignVertical: 'center',
        maxWidth: sizes.size170,
        marginLeft: sizes.size5,
        marginBottom: sizes.size5,
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        fontWeight: '500',
        color: Colors.black

    },
    searchContainer: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        borderRadius: sizes.size30,
        borderWidth: sizes.size1,
        flexDirection: 'row',
        margin: sizes.size8,
        paddingHorizontal: sizes.size10,
        paddingVertical: sizes.size8,
    },
    searchInput: {
        marginTop: sizes.size15,
        paddingBottom: sizes.size12,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    leftSwipeableButton: {
        paddingLeft: sizes.size116,
        paddingRight: sizes.size8,
        paddingVertical: sizes.size20,
    },
    rightSwipeableButton: {
        paddingHorizontal: sizes.size16,
        paddingVertical: sizes.size20,
    },
    swipeableContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    userPhoto: {
        width: sizes.size42,
        height: sizes.size42,
        borderWidth: sizes.size1,
        borderRadius: sizes.size45,
        borderColor: Colors.grayBorder
    },
    userPhotoGroup: {
        width: sizes.size33,
        height: sizes.size33,
    },
    defaultUserImageContainer: {
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultUserImage: {
        width: sizes.size17,
        height: sizes.size23
    },
    defaultUserImageGroup: {
        width: sizes.size12,
        height: sizes.size17
    },
    groupSecondAvatar: {
        marginLeft: -sizes.size23,
        marginTop: sizes.size7
    },
    marker: {
        width: sizes.size7,
        height: sizes.size7,
        borderRadius: sizes.size3p5,
        marginRight: sizes.size5,
        backgroundColor: Colors.appColor1
    },
    lastMessage: {
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        maxWidth: sizes.size190,
        color: Colors.grayText
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingGif: {
        width: sizes.size30,
        height: sizes.size7,
    },
});
