import { Dimensions } from 'react-native';
import DeviceInfoReact from 'react-native-device-info';
import {Platform} from 'react-native';

export const DeviceInfo = {
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height,
    appVersion: DeviceInfoReact.getVersion(),
    hasNotch: DeviceInfoReact.hasNotch(),
    deviceId: DeviceInfoReact.getUniqueId(),
    ios: Platform.OS === 'ios',
    android: Platform.OS === 'android',
    bundleId: DeviceInfoReact.getBundleId()
};
