import {StyleSheet} from 'react-native';
import {sizes} from "../../assets/sizes";
import {Colors} from "../../assets/RootStyles";
import {DeviceInfo} from "../../assets/DeviceInfo";

export default StyleSheet.create({
    notificationContainer: {
        width:"100%",
        height: sizes.size75,
        borderRadius: sizes.size7,
        shadowOffset: {width: 0, height: sizes.size2},
        shadowRadius: sizes.size2,
        shadowOpacity: 0.5,
        backgroundColor: Colors.white,
        marginTop: DeviceInfo.android?sizes.size25:0
    },
    notificationContent: {
        paddingHorizontal: sizes.size17,
        paddingVertical: sizes.size9,
        flexDirection: "row",
    },
    notificationImageContainer: {
        width: sizes.size49,
        height: sizes.size49,
        borderRadius: sizes.size49,
        marginRight: sizes.size18,
        borderColor: Colors.inputBottomBorder,
        borderWidth: sizes.size1,
        alignItems: "center",
        justifyContent: "center"
    },
    notificationImage: {
        width: '100%',
        height: '100%',
        borderRadius: sizes.size50
    },
    notificationImageDefault: {
        width: sizes.size18,
        height: sizes.size22
    },
    notificationImageLogo: {
        width: sizes.size49,
        height: sizes.size49
    },
    notificationInfoName: {
        color: Colors.black,
        fontSize: sizes.size16,
        fontWeight: '500',
        marginBottom: sizes.size4
    },
    notificationInfoMessage: {
        color: Colors.grayText,
        fontSize: sizes.size13,
        maxWidth: sizes.size260
    },
    notificationBottomBorderContainer: {
        alignItems: "center"
    },
    notificationBottomBorderItem: {
        width: sizes.size35,
        height: sizes.size2,
        backgroundColor: Colors.inputBottomBorder,
        borderRadius: sizes.size1
    },
    notificationContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: sizes.size4
    },
});
