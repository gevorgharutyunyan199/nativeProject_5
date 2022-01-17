import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';

export default StyleSheet.create({
    androidMenu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blackOpacity4
    },
    contentContainer: {
        marginHorizontal: sizes.size40,
        backgroundColor: Colors.white,
        borderRadius: sizes.size4,
        paddingBottom: sizes.size14,
        paddingTop: sizes.size20
    },
    textContainer: {
        paddingHorizontal: sizes.size24,
    },
    dialogTitle: {
        fontFamily: fonts.regular,
        fontSize: sizes.size20,
        fontWeight: 'bold',
        color: Colors.dialogBlackTitle,
        marginBottom: sizes.size12,
        lineHeight: sizes.size28
    },
    dialogBody: {
        fontFamily: fonts.regular,
        fontSize: sizes.size16,
        color: Colors.grayText,
        lineHeight: sizes.size24,
        marginBottom: sizes.size41
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    dialogButton: {
        marginRight: sizes.size28,
        fontFamily: fonts.regular,
        fontSize: sizes.size14,
        fontWeight: 'bold',
        color: Colors.cancel
    }
});
