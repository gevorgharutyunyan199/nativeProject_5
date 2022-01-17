import {StyleSheet} from 'react-native';
import {Colors, fonts} from '../../assets/RootStyles';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.searchInputColor
    },
    defaultUserImageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultUserImage: {
        width: sizes.size41,
        height: sizes.size45
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: sizes.size30,
        marginBottom: sizes.size33
    },
    imageContentContainer: {
        position: 'relative'
    },
    editPhotoButton: {
        position: 'absolute',
        zIndex: 10,
        bottom: 0,
        right: 0
    },
    userPhoto: {
        backgroundColor: Colors.white,
        width: sizes.size110,
        height: sizes.size110,
        borderWidth: sizes.size3,
        borderRadius: sizes.size60,
        borderColor: Colors.appColor1
    },
    blockBorder: {
        borderBottomWidth: sizes.size1,
        borderTopWidth: sizes.size1,
        borderColor: Colors.grayBorder,
    },
    notesBlock: {
        backgroundColor: Colors.white,
        height: sizes.size100,
        paddingHorizontal: sizes.size20,
        paddingVertical: sizes.size16
    },
    noteTextInputStyle: {
        paddingVertical: 0,
        height: sizes.size60,
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black,
    },
    actionButton: {
        backgroundColor: Colors.white,
        paddingHorizontal: sizes.size20,
        paddingVertical: sizes.size16
    },
    actionButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.wrong
    },
    inputBorderBottom: {
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    inputBloch: {
        backgroundColor: Colors.white,
        paddingHorizontal: sizes.size20,
        paddingVertical: sizes.size16
    },
    inputBlochPadding: {
        paddingHorizontal: sizes.size10
    },
    inputStyle: {
        paddingVertical: 0,
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    },
    headerContainer: {
        backgroundColor: Colors.white,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        paddingBottom: DeviceInfo.android?sizes.size16:0
    },
    androidMenu: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: Colors.blackOpacity4
    },
    bottomSheetContainer: {
        borderTopRightRadius: sizes.size20,
        borderTopLeftRadius: sizes.size20,
        backgroundColor: Colors.white
    },
    bottomSheetHeader: {
        marginHorizontal: sizes.size12,
        height: sizes.size96,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    lineContainer: {
        paddingTop: sizes.size16,
        alignItems: 'center'
    },
    line: {
        width: sizes.size40,
        height: sizes.size4,
        borderRadius: sizes.size2,
        backgroundColor: Colors.lineColor
    },
    bottomSheetTitle: {
        fontFamily: fonts.regular,
        fontSize: sizes.size18,
        fontWeight: 'bold',
        color: Colors.black,
        marginTop: sizes.size37,
        marginHorizontal: sizes.size8
    },
    bottomSheetContent: {
        marginHorizontal: sizes.size20
    },
    button: {
        height: sizes.size77,
        justifyContent: 'center'
    },
    buttonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size18,
        color: Colors.black
    },
    blockMarginBottom: {
        marginBottom: sizes.size41
    },
    addButton: {
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginBottom: sizes.size41,
        paddingHorizontal: sizes.size17,
        paddingVertical: sizes.size11,
        flexDirection: 'row'
    },
    addButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black,
        marginLeft: sizes.size12
    },
    selectedTone: {
        fontWeight: '500',
        color: Colors.activeBullet
    },
    rowContainer: {
        flexDirection: 'row'
    },
    deleteText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.white
    },
    hiddenItemContainer: {
        height: sizes.size63,
        backgroundColor: Colors.white,
        alignItems: 'flex-end'
    },
    deleteButton: {
        backgroundColor: Colors.wrong,
        height: sizes.size51,
        width: sizes.size85,
        justifyContent: 'center',
        alignItems: 'center'
    },
    phoneNumberItemContainer: {
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: sizes.size22,
        flexDirection: 'row'
    },
    dateText: {
        marginRight: sizes.size8,
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.grayText
    },
    labelText: {
        paddingVertical: sizes.size15,
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.activeBullet,
        marginLeft: sizes.size17,
        marginRight: "auto"
    },
    gradientLine: {
        width: sizes.size1,
        height: '100%',
        marginLeft: sizes.size5
    },
    labelButton: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: '55%'
    },
    addressInputBloch: {
        backgroundColor: Colors.white,
        padding: 0
    },
    addressInput: {
        paddingVertical: sizes.size17,
        paddingHorizontal: sizes.size20,
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder,
    },
    countryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingVertical: sizes.size12,
        paddingLeft: sizes.size20,
    },
    countryButtonText: {
        fontFamily: fonts.regular,
        fontSize: sizes.size17,
        color: Colors.black
    }
});
