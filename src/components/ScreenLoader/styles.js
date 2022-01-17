import {StyleSheet} from 'react-native';
import {Colors} from '../../assets/RootStyles';

export default StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.screenLoaderBackground,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mediaBack: {
        backgroundColor: Colors.screenLoaderBackground01
    }
});
