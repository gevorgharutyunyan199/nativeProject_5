import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: sizes.size11,
        paddingVertical: sizes.size12,
        alignItems: 'center',
        borderBottomWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    itemName: {
        fontFamily: fonts.regular,
        fontSize: sizes.size15,
        fontWeight: '500',
        color: Colors.black
    },
    centerContainer: {
        flex: 1
    },
    number: {
        fontFamily: fonts.regular,
        fontSize: sizes.size13,
        color: Colors.grayText,
        marginTop: sizes.size5
    },
    time: {
        marginRight: sizes.size10,
        fontFamily: fonts.regular,
        fontSize: sizes.size12,
        color: Colors.grayText,
        marginTop: sizes.size5,
        marginBottom: sizes.size3
    }
});
