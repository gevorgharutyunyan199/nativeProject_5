import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors, fonts} from '../../assets/RootStyles';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: sizes.size17p5,
        height: sizes.size52,
        alignItems: 'center',
        borderTopWidth: sizes.size1,
        borderColor: Colors.grayBorder
    },
    text: {
        marginLeft: sizes.size7,
        fontFamily: fonts.regular,
        color: Colors.black,
        fontSize: sizes.size17,
        maxWidth: '90%'
    }
});
