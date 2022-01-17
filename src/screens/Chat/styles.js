import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    contentContainer: {
        flex: 1
    },
    headerContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingBottom: DeviceInfo.android?sizes.size16:0
    },
    toSectionContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        flexDirection: 'row',
        paddingVertical: sizes.size6
    },
    itemsGroupAndToInputContainer:{
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    toText: {
        marginTop: sizes.size5,
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        color: Colors.placeholderTextColor,
        marginLeft: sizes.size20,
        marginRight: sizes.size10
    },
    chatSelectedItem: {
        maxWidth: sizes.size270,
        marginTop: sizes.size5,
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        color: Colors.appColor1,
        marginRight: sizes.size10
    },
    addButton: {
        backgroundColor: Colors.white,
        paddingHorizontal: sizes.size13,
        width: sizes.size58
    },
    toInput: {
        marginTop: sizes.size5,
        minWidth: sizes.size100,
        paddingVertical: 0,
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        color: Colors.black
    },
    suggestionsListItemContainer: {
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingHorizontal: sizes.size20,
        paddingVertical: sizes.size10
    },
    suggestionsItemTitle: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17p5,
        color: Colors.black
    },
    suggestionsItemNumber: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13p5,
        color: Colors.grayLinkText,
        marginTop: sizes.size4
    },
    androidChatMenu: {
        flex: 1,
        alignItems: 'flex-end'
    },
    deleteButton: {
        width: sizes.size165,
        height: sizes.size50,
        backgroundColor: Colors.white,
        marginTop: sizes.size50,
        marginRight: sizes.size6,
        shadowColor: Colors.black,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: sizes.size22
    },
    deleteButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black,
        marginLeft: sizes.size10
    }
});
