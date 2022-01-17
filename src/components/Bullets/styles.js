import {StyleSheet} from 'react-native';
import {sizes} from '../../assets/sizes';
import {Colors} from '../../assets/RootStyles';

export default StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    bulletButton: {
        paddingHorizontal: sizes.size7p5
    },
    bullet: {
        width: sizes.size6,
        height: sizes.size6,
        borderRadius: sizes.size6,
        backgroundColor: Colors.grayBullet
    },
    activeBullet: {
        backgroundColor: Colors.activeBullet
    }
});
