import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import styles from './styles';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {GradientButton, Bullets} from '../../components';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import NavigationService from "../../services/NavigationService";

class WelcomePage extends Component {

    state = {
        activeSlide: 1
    };

    componentDidMount() {
        NavigationService.init(this.props.navigation);
    }

    onMomentumScrollEnd = (e)=>{
        this.setState({
            activeSlide: DeviceInfo.android?Math.round(e.nativeEvent.contentOffset.x/DeviceInfo.deviceWidth+1):e.nativeEvent.contentOffset.x/DeviceInfo.deviceWidth+1
        })
    };

    render() {
        const {navigation} = this.props;
        const {activeSlide} = this.state;

        return (
            <View style={styles.screen}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}
                >
                    <View style={styles.contentContainer}>
                        <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
                        <View style={styles.boldTextContainer}>
                            <Text style={styles.boldText}>Your Second Line</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>Use one device for multiple numbers.</Text>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
                        <View style={styles.boldTextContainer}>
                            <Text style={styles.boldText}>Unlimited Calls & Texts</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>Make high quality calls and send messages to anyone on any number.</Text>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
                        <View style={styles.boldTextContainer}>
                            <Text style={styles.boldText}>Reliable Connection</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>Use your current cellular connection for your second line keeping all your lines reliable.</Text>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
                        <View style={styles.boldTextContainer}>
                            <Text style={styles.boldText}>Contact Management</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>Keep your contacts organized and separate.</Text>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
                        <View style={styles.boldTextContainer}>
                            <Text style={styles.boldText}>Voicemail</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>Create your own customized voicemail greetings.</Text>
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
                        <View style={styles.boldTextContainer}>
                            <Text style={styles.boldText}>Enable Quiet Time</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionText}>Disconnect during your off hours.</Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Bullets active={activeSlide}/>
                    <View style={styles.buttonContainer}>
                        <GradientButton onPress={()=>{navigation.navigate('SignUpStep1')}} title={'GET STARTED'} disabled={false}/>
                    </View>
                    <View style={styles.signInContainer}>
                        <Text style={styles.accountText}>Already have an account? </Text>
                        <TouchableOpacity onPress={()=>{navigation.navigate('SignInPage')}}>
                            <Text style={styles.signInButton}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.versionText}>Version {DeviceInfo.appVersion}</Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = store =>{
    return {
        signUpData: store.SignUpReducer
    }
};

export default connect(mapStateToProps,{makeAction})(WelcomePage)
