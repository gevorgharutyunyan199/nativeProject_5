import React, {Component} from 'react';
import {View, Image, TouchableOpacity, StatusBar, AppState, Text, Alert, ActivityIndicator} from 'react-native';
import styles from './styles';
import {sizes} from "../../assets/sizes";
import {Colors} from "../../assets/RootStyles";
import {Cancel, Send, PlayVideo, PauseVideo, SelectImage} from "../../assets/icons";
import Video from 'react-native-video';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {AndroidAlertDialog} from "../AndroidAlertDialog";

class Preview extends Component {

    state = {
        pageY: null,
        played: this.props.onlyShow,
        time: 0,
        loader: true
    };

    componentDidMount() {
        if(DeviceInfo.ios) {
            StatusBar.setHidden(true);
        }
        AppState.addEventListener('change',this._stateChange)
    }

    componentWillUnmount() {
        if(DeviceInfo.ios) {
            StatusBar.setHidden(false);
        }
        AppState.removeEventListener('change',this._stateChange)
    }

    _stateChange = (state)=>{
        if(state === 'inactive' || state === 'background'){
            this.setState({
                played: false
            })
        }
    };

    touchStart = (e)=>{
       this.setState({
           pageY: e.nativeEvent.pageY
       })
    };

    closeModal = ()=>{
        const {file,onlyShow} = this.props;

        if(file.camera && !onlyShow){
            if(DeviceInfo.ios){
                Alert.alert(
                    "Discard Changes?",
                    "If you discard the changes, your \nmedia will be lost.",
                    [
                        {
                            text: 'Keep',
                            onPress: () => {}
                        },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => {
                                this.props.hideModal();
                                StatusBar.setHidden(true);
                            }
                        }
                    ]
                );
            }else {
                this.androidAlertDialog.openDialog({
                    title: 'Discard Changes?',
                    body: 'If you discard the changes, your \nmedia will be lost.',
                    buttons: [{
                        title: 'KEEP',
                        onPress: ()=>{}
                    },{
                        title: 'DISCARD',
                        wrong: true,
                        onPress: ()=>{
                            this.props.hideModal();
                            StatusBar.setHidden(true);
                        }
                    }]
                })
            }
        }else{
            this.props.hideModal()
        }
    };

    touchEnd = (e)=>{
        if(this.state.pageY && this.state.pageY+50<e.nativeEvent.pageY){
            this.closeModal()
        }
        this.setState({
            pageY: null
        })
    };

    playPose = ()=>{
        this.setState({
            played: !this.state.played
        })
    };

    convertTime = (duration)=>{
        let time = (Math.floor(duration / 1000));
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        return `${minutes<10?`0${minutes}`:minutes}:${seconds<10?`0${seconds}`:seconds}`
    };

    onProgress = (progress)=>{
        this.setState({
            time: Math.round(progress.currentTime)
        })
    };

    render() {
        const {played, time, loader} = this.state;
        const {file, send, contactImageSelect} = this.props;

        let videoUri = '';
        if(file && file.type.indexOf('video')>-1 && file.uri.indexOf('ph')>-1 && !file.camera){
            let regex = /:\/\/(.{36})\//i;
            let result = file.uri.match(regex);
            let nameArr = file.name?file.name.split('.'):['','mp4'];
            let fileName = nameArr[nameArr.length-1];
            videoUri = `assets-library://asset/asset.${fileName}?id=${result[1]}&ext=${fileName}`;
        }else if(file.type.indexOf('video')>-1 && file.camera){
            videoUri = file.uri
        }else{
            videoUri = file.uri
        }

        return(
            <View style={styles.screen} onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
                <AndroidAlertDialog ref={ref => this.androidAlertDialog = ref}/>
                {loader?<View style={styles.loaderContainer}>
                    <ActivityIndicator size={'small'} color={Colors.white}/>
                </View>:null}
                <View style={styles.contentContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={this.closeModal}>
                        <Cancel width={sizes.size32} height={sizes.size32} color={Colors.white} />
                    </TouchableOpacity>
                    {send ?
                        <TouchableOpacity style={styles.sendButton} onPress={() => {
                            send(file)
                        }}>
                            {
                                contactImageSelect
                                    ? <SelectImage width={sizes.size69} height={sizes.size69}/>
                                    : file.converted
                                        ? <Send width={sizes.size69} height={sizes.size69}/>
                                        : <View>
                                            <ActivityIndicator size={'large'} color={Colors.white}/>
                                        </View>
                            }

                        </TouchableOpacity> : null}
                    {file && file.type.indexOf('image') > -1 ? <View>
                        <Image
                            source={{uri: file.uri}}
                            style={styles.imageVideo}
                            resizeMode={'contain'}
                            onLoadEnd={()=>{
                                this.setState({
                                    loader: false
                                })
                            }}
                        />
                    </View>:null}
                    {file && file.type.indexOf('video')>-1?<View>
                        <Video
                            source={{uri: videoUri,cache: { expiresIn: 3600 }}}
                            ref={(ref) => {this.player = ref}}
                            style={styles.imageVideo}
                            resizeMode={'cover'}
                            paused={!played}
                            repeat={true}
                            onEnd={() => {
                                this.setState({
                                    played: false,
                                    time: 0
                                })
                            }}
                            onProgress={this.onProgress}
                            ignoreSilentSwitch={"ignore"}
                            onLoad={()=>{
                                this.setState({
                                    loader: false
                                });
                                if(DeviceInfo.android){
                                    this.setState({
                                        played: true
                                    },()=>{
                                        this.setState({
                                            played: false,
                                        })
                                    })
                                }
                            }}
                            onError={(e)=>{
                                console.log(e)
                            }}
                        />
                        {!loader?<TouchableOpacity style={styles.playButton} onPress={this.playPose}>
                            {played?<PauseVideo width={sizes.size69} height={sizes.size69} />
                            :<PlayVideo width={sizes.size69} height={sizes.size69} />}
                        </TouchableOpacity>:null}
                        <View style={styles.timerContainer}>
                            <View style={styles.dot}/>
                            <Text style={styles.timerText}>{this.convertTime(time*1000)}</Text>
                        </View>
                    </View>:null}
                </View>
            </View>
        )
    }
}

export {Preview}
