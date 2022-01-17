import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors} from '../../assets/RootStyles';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.searchInputColor,
        padding: sizes.size10
    },
    imageButton: {
        paddingLeft: sizes.size3,
        marginRight: sizes.size4
    }
});
