import React, {Component} from 'react';
import {View} from 'react-native';
import styles from './styles';
import {ScreenHeader,ScreenLoader} from '../../components';
import { WebView } from 'react-native-webview';
import {DeviceInfo} from "../../assets/DeviceInfo";

class PrivacyPolicy extends Component {
    state = {
        visible: true
    };

    hideSpinner = ()=>{
        this.setState({ visible: false });
    };

    render() {
        const {navigation,route} = this.props;
        const {visible} = this.state;

        let url = 'https://beta.bluip.io/storage/5b3fac9292d2dc8216564ca0.pdf';

        if(route.params.type === 'privacy'){
            url = 'https://www.bluip.com/wp-content/uploads/2020/01/BIP.Privacy-Policy.vers_.01.01.20.cln_.pdf';
        }

        if(DeviceInfo.android){
            url = `https://docs.google.com/gview?url=${url}`
        }

        return (
            <View style={styles.screen}>
                <ScreenHeader
                    title={route.params.type === 'privacy'?'Privacy Policy':'Terms of Service'}
                    leftIcon={'Back'}
                    leftIconPress={()=>{navigation.goBack()}}
                />
                <WebView
                    style={styles.screen}
                    onLoad={() => this.hideSpinner()}
                    source={{uri: url}}
                />
                {visible?<ScreenLoader/>:null}
            </View>
        );
    }
}

export default PrivacyPolicy
