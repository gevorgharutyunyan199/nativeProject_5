import {StyleSheet} from 'react-native';
import {sizes} from "../../../assets/sizes";
import {Colors} from "../../../assets/RootStyles";

export default StyleSheet.create({
    userImageContainer: {
        width: sizes.size30,
        height: sizes.size30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        borderRadius: sizes.size50,
        borderColor: Colors.inputBottomBorder,
        borderWidth: sizes.size1,
        marginRight: sizes.size9
    },
    userImage: {
        width: sizes.size13,
        height: sizes.size16
    },
    senderUserImage: {
        width: '100%',
        height: '100%',
        borderRadius: sizes.size50
    }
});
