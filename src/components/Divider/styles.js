import {StyleSheet} from 'react-native';
import {sizes} from "../../assets/sizes";
import {Colors} from "../../assets/RootStyles";

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems:'center',
        paddingHorizontal: sizes.size7p5,
        marginVertical: sizes.size15p8
    },
    dividerItem:{
        borderBottomWidth: sizes.size1,
        height: sizes.size1,
        flex: 1,
        borderColor: Colors.grayBorder
    },
    text:{
        paddingHorizontal: sizes.size20p5,
        fontSize: sizes.size12,
        color: Colors.placeholderTextColor
    }

});
