import React, {Component} from 'react';
import {Animated, View, TouchableOpacity, Text, Easing, StatusBar, Alert} from 'react-native';
import styles from "./styles";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {sizes} from "../../assets/sizes";
import LinearGradient from "react-native-linear-gradient";
import {Colors} from "../../assets/RootStyles";
import { RNCamera } from 'react-native-camera';
import {CameraRevert, Cancel, TakePhoto, TakeVideo, Recording} from '../../assets/icons';
import ZoomView from './ZoomView';
import {Preview} from "../../components";
import KeepAwake from '@sayem314/react-native-keep-awake';
const ZOOM_F = DeviceInfo.ios ? 0.01 : 0.1;

class CameraPage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            pageX: null,
            left: new Animated.Value((DeviceInfo.deviceWidth-sizes.size150/2)/2),
            active: 1,
            cameraType: 'back',
            zoom: 0,
            modalVisible: false,
            selectedItem: null,
            onlyPhoto: true,
            recordingStarted: false,
            videoDuration: 0
        };

        this._prevPinch = 1;

    }

    componentDidMount() {
        const {route} = this.props;
        if(route.params){
            this.setState({
                onlyPhoto: route.params.onlyPhoto
            })
        }else {
            this.setState({
                onlyPhoto: false
            })
        }
        if(DeviceInfo.ios){
            StatusBar.setHidden(true);
        }else {
            this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
                StatusBar.setBarStyle('light-content')
            })

            this.navigationListenerBlur = this.props.navigation.addListener('blur', async () => {
                StatusBar.setBarStyle('dark-content')
            })
        }
    }

    componentWillUnmount() {
        if(DeviceInfo.ios) {
            StatusBar.setHidden(false);
        }
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove()
        }
        if(this.navigationListenerBlur && this.navigationListenerBlur.remove){
            this.navigationListenerBlur.remove()
        }
    }

    onPinchProgress = (p) => {
        let p2 = p - this._prevPinch;

        if(p2 > 0 && p2 > ZOOM_F){
            this._prevPinch = p;
            this.setState({zoom: Math.min(this.state.zoom + ZOOM_F, 1)})
        }
        else if (p2 < 0 && p2 < -ZOOM_F){
            this._prevPinch = p;
            this.setState({zoom: Math.max(this.state.zoom - ZOOM_F, 0)})
        }
    };

    touchStart = (e)=>{
        if(this.state.modalVisible || this.state.onlyPhoto || this.state.recordingStarted){
            return
        }
        this.setState({
            pageX: e.nativeEvent.pageX
        })
    };

    touchEnd = (e)=>{
        if(this.state.modalVisible || this.state.onlyPhoto){
            return
        }
        if(this.state.pageX && this.state.pageX+30<e.nativeEvent.pageX){
            Animated.timing(this.state.left, {
                toValue: (DeviceInfo.deviceWidth-sizes.size150/2)/2,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(()=>{
                this.setState({
                    active: 1
                })
            });
        }

        if(this.state.pageX && this.state.pageX>e.nativeEvent.pageX+30){
            Animated.timing(this.state.left, {
                toValue: ((DeviceInfo.deviceWidth-sizes.size150/2)/2)-sizes.size75,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(()=>{
                this.setState({
                    active: 2
                })
            });
        }

        this.setState({
            pageX: null
        })
    };

    changeCameraType = ()=>{
        this.setState({
            cameraType: this.state.cameraType === 'back' ? 'front' : 'back',
        });
    };

    selectCameraType = (type)=>{
        if(this.state.active !== type){
            if(type === 1){
                Animated.timing(this.state.left, {
                    toValue: (DeviceInfo.deviceWidth-sizes.size150/2)/2,
                    duration: 200,
                    easing: Easing.linear,
                    useNativeDriver: false
                }).start(()=>{
                    this.setState({
                        active: 1
                    })
                });
            }

            if(type === 2){
                Animated.timing(this.state.left, {
                    toValue: ((DeviceInfo.deviceWidth-sizes.size150/2)/2)-sizes.size75,
                    duration: 200,
                    easing: Easing.linear,
                    useNativeDriver: false
                }).start(()=>{
                    this.setState({
                        active: 2
                    })
                });
            }
        }
    };

    hideModal = ()=>{
        this.setState({
            modalVisible: false
        })
    };

    takePhoto = async ()=>{
        const {cameraType} = this.state;
        if (this.camera) {
            const options = {
                quality: 0.5,
                base64: true,
                mirrorImage: cameraType === 'front',
                forceUpOrientation: cameraType === 'front',
            };

            if(DeviceInfo.android){
                options.fixOrientation = true
            }

            const data = await this.camera.takePictureAsync(options);

            this.setState({
                modalVisible: true,
                selectedItem: {
                    type: 'image',
                    uri: data.uri,
                    name: `${new Date().getTime()}`,
                    size: null,
                    camera: true
                }
            });
        }
    };

    convertTime = (duration)=>{
        let time = (Math.floor(duration / 1000));
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        return `${minutes<10?`0${minutes}`:minutes}:${seconds<10?`0${seconds}`:seconds}`
    };

    takeVideo = async ()=>{
        const {cameraType, recordingStarted} = this.state;
        if(this.camera) {
            if(!recordingStarted){
                if(this.timer){
                    clearInterval(this.timer)
                }
                this.timer = setInterval(()=>{
                    this.setState({
                        videoDuration: this.state.videoDuration+1000
                    })
                },1000);
                this.setState({
                    recordingStarted: true
                });
                const options = {
                    videoBitrate: 0.5 * 1000 * 1000,
                    quality: RNCamera.Constants.VideoQuality["480p"],
                    orientation: 'portrait',
                    mirrorVideo: cameraType === 'front',
                    forceUpOrientation: cameraType === 'front',
                    maxDuration: 120
                };

                if(DeviceInfo.ios){
                    options.codec = RNCamera.Constants.VideoCodec['H264']
                }

                this.camera.recordAsync(options).then((res)=>{
                    if(this.state.videoDuration/1000 >= 119){
                        Alert.alert(
                            'Video Recording Stopped',
                            'The maximum length for this video\nhas been reached.'
                        );
                    }
                    this.setState({
                        modalVisible: true,
                        selectedItem: {
                            type: 'video',
                            uri: res.uri,
                            name: `${new Date().getTime()}`,
                            size: null,
                            camera: true
                        },
                        recordingStarted: false,
                        videoDuration: 0
                    });
                    if(this.timer){
                        clearInterval(this.timer)
                    }
                });
            }else {
                this.setState({
                    videoDuration: 0
                });
                await this.camera.stopRecording();
                if(this.timer){
                    clearInterval(this.timer)
                }
            }
        }
    };

    send = (data)=>{
        const {route} = this.props;
        if(route.params && route.params.send){
            route.params.send({
                type: data.type,
                uri: data.uri,
                name: `${new Date().getTime()}`,
                size: null,
                camera: true
            });
            this.props.navigation.goBack();
            this.hideModal();
        }
    };

    render() {
        const {left, active, cameraType, zoom, modalVisible, selectedItem, recordingStarted, videoDuration} = this.state;
        const {navigation, route} = this.props;
        let onlyPhoto;
        if(route.params){
            onlyPhoto = route.params.onlyPhoto
        }else {
            onlyPhoto = false
        }

        return(
            modalVisible?<Preview
                file={selectedItem}
                hideModal={this.hideModal}
                send={this.send}
                contactImageSelect={route.params?route.params.contactImageSelect:false}
            />:<View style={styles.screen} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
                <KeepAwake />
                <TouchableOpacity style={styles.closeButton} onPress={navigation.goBack}>
                    <Cancel width={sizes.size32} height={sizes.size32} color={Colors.white} />
                </TouchableOpacity>

                <View style={ styles.preview }>
                    <ZoomView style={{flex:1}} onPinchProgress={this.onPinchProgress}>
                        <RNCamera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            captureAudio={!onlyPhoto}
                            style={styles.camera}
                            torchMode={true}
                            type={cameraType}
                            zoom={zoom}
                        />
                    </ZoomView>
                </View>

                {active===1?<TouchableOpacity style={styles.takePhotoButton} onPress={this.takePhoto}>
                    <TakePhoto width={sizes.size69} height={sizes.size69}/>
                </TouchableOpacity>:null}

                {active===2?<TouchableOpacity style={styles.takePhotoButton} onPress={this.takeVideo}>
                    {recordingStarted?<Recording width={sizes.size69} height={sizes.size69}/>
                    :<TakeVideo width={sizes.size69} height={sizes.size69}/>}
                </TouchableOpacity>:null}

                {active===2?<View style={styles.timerContainer}>
                    <View style={[styles.dot,recordingStarted?{backgroundColor: Colors.wrong}:null]}/>
                    <Text style={styles.timerText}>{this.convertTime(videoDuration)}</Text>
                </View>:null}

                {!recordingStarted?<View style={styles.footer}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.84 }} colors={[Colors.blackOpacity, Colors.originalBlack]}>
                        <View style={styles.footerContentContainer}>
                            {!onlyPhoto?<View style={styles.lineContainer}>
                                <View style={styles.line}/>
                            </View>:null}

                            {!onlyPhoto?<Animated.View style={[styles.videoImageSelectorContainer,{left: left}]}>
                                <TouchableOpacity style={styles.selector} onPress={()=>{this.selectCameraType(1)}}>
                                    <Text style={active===1?styles.activeText:styles.inactiveText}>PHOTO</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.selector} onPress={()=>{this.selectCameraType(2)}}>
                                    <Text style={active===2?styles.activeText:styles.inactiveText}>VIDEO</Text>
                                </TouchableOpacity>
                            </Animated.View>:null}

                            <TouchableOpacity style={styles.cameraRevertButton} onPress={this.changeCameraType}>
                                <CameraRevert width={sizes.size32} height={sizes.size32}/>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>:null}
            </View>
        )
    }
}

export default CameraPage
