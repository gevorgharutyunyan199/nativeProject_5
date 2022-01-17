import React, {Component} from 'react';
import {Text, TouchableOpacity, View, TextInput, Alert, Linking} from 'react-native';
import styles from './styles';
import {TabScreenHeader, ScreenLoader, AndroidAlertDialog} from '../../components';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {Colors, iconsColors} from "../../assets/RootStyles";
import AudioRecord from 'react-native-audio-record';
import * as Progress from 'react-native-progress';
import {Pause, Play} from "../../assets/icons";
import {sizes} from "../../assets/sizes";
import Sound from 'react-native-sound';
import {check, request, PERMISSIONS} from "react-native-permissions";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {
    ADD_VOICEMAIL_GREETING,
    DELETE_VOICEMAIL_GREETING, GET_AUDIO_FILE_BY_NAME,
    UPDATE_VOICEMAIL_GREETING
} from "../../actionsTypes";
import RNFS from "react-native-fs";

class EditGreeting extends Component{

    state = {
        loaderVisible: true,
        newGreeting: false,
        recording: false,
        audioFile: '',
        name: '',
        played: false,
        progress: 0,
        duration: 0,
        oldName: ''
    };

    componentDidMount() {
        const {route} = this.props;
        if(route.params && route.params.newGreeting){
            this.setState({
                newGreeting: true,
                loaderVisible: false
            })
        }else{
            this.props.makeAction(GET_AUDIO_FILE_BY_NAME,{
                callback: (data)=>{
                    const path = `${RNFS.DocumentDirectoryPath}/${this.props.route.params.item.name}.wav`;
                    RNFS.writeFile(path, data, 'base64').then(() => {
                        this.sound = new Sound(path, ``, () => {
                            this.setState({
                                duration: Math.round(this.sound.getDuration()),
                                audioFile: `${RNFS.DocumentDirectoryPath}/${this.props.route.params.item.name}.wav`,
                                loaderVisible: false,
                                name: this.props.route.params.item.name,
                                oldName: this.props.route.params.item.name
                            })
                        });
                    }, (e)=>{
                        console.log(e);
                    });
                },
                error: ()=>{
                    this.setState({
                        loaderVisible: false,
                        name: this.props.route.params.item.name,
                        oldName: this.props.route.params.item.name
                    })
                },
                name: this.props.route.params.item.name
            });
        }
        AudioRecord.on('data', data => {});
    }

    componentWillUnmount() {
        if(this.sound){
            this.sound.release();
        }
        if(this.timeOute){
            clearTimeout(this.timeOute)
        }
        if(this.state.recording) {
            AudioRecord.stop();
        }
    }

    save = ()=>{
        if(this.state.newGreeting){
            let index = this.props.userInfo.voicemailGreeting.findIndex((item)=>{
                return item.name === this.state.name.trim()
            });

            if(index>-1){
                Alert.alert('You already have a voicemail with this name. Please choose another.','');
                return
            }

            this.setState({
                loaderVisible: true
            });

            this.props.makeAction(ADD_VOICEMAIL_GREETING,{
                callback: ()=>{
                    this.setState({
                        loaderVisible: false
                    });
                    this.props.navigation.goBack();
                    if(this.props.route.params && this.props.route.params.getData){
                        this.props.route.params.getData()
                    }
                },
                error: ()=>{
                    this.setState({
                        loaderVisible: false
                    });
                },
                uri: this.state.audioFile,
                name: this.state.name
            });
        }else{
            this.setState({
                loaderVisible: true
            });

            this.props.makeAction(UPDATE_VOICEMAIL_GREETING,{
                callback: ()=>{
                    this.setState({
                        loaderVisible: false,
                        oldName: this.state.name
                    });
                    this.props.navigation.goBack();
                    if(this.props.route.params && this.props.route.params.getData){
                        this.props.route.params.getData()
                    }
                },
                error: ()=>{
                    this.setState({
                        loaderVisible: false
                    });
                },
                newName: this.state.name,
                name: this.state.oldName
            });
        }
    };

    onEnd = ()=>{
        this.stopTimeLineUpdate(()=>{
            this.setState({
                played: false,
                progress: 1
            });
        });
    };

    reRecording = async ()=>{
        if(this.sound){
            this.sound.release();
        }
        this.setState({
            audioFile: '',
            duration: 0,
            progress: 0,
            played: false
        },async ()=>{
            await this.startRecording()
        })
    }

    checkMicrophone = async ()=>{
        let permission = await check(DeviceInfo.ios?PERMISSIONS.IOS.MICROPHONE:PERMISSIONS.ANDROID.RECORD_AUDIO);

        if(permission === 'blocked'){
            Alert.alert(
                "Microphone Unavailable",
                "LineX does not have access to your \nmicrophone. To enable access, go to \nSettings and turn on Microphone.",
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Settings', onPress: () => DeviceInfo.ios?Linking.openURL('app-settings://'):Linking.openSettings()}
                ]
            );
        }else if(permission === 'granted'){
            await this.startRecording();
        }else {
            let res = await request(DeviceInfo.ios?PERMISSIONS.IOS.MICROPHONE:PERMISSIONS.ANDROID.RECORD_AUDIO);

            if(res === 'granted'){
                await this.startRecording();
            }else {
                Alert.alert(
                    "Microphone Unavailable",
                    "LineX does not have access to your \nmicrophone. To enable access, go to \nSettings and turn on Microphone.",
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Settings', onPress: () => DeviceInfo.ios?Linking.openURL('app-settings://'):Linking.openSettings()}
                    ]
                );
            }
        }
    }

    startRecording = async ()=>{
        if(this.timeOute){
            clearTimeout(this.timeOute)
        }
        if(this.state.recording){
            let audioFile = await AudioRecord.stop();
            this.setState({
                audioFile: audioFile
            });
            this.sound = Sound.setCategory('Playback');
            this.sound = new Sound(audioFile,'', () => {
                this.setState({
                    duration: Math.round(this.sound.getDuration())
                },()=>{
                    this.playPause()
                })
            });
        }else {
            const options = {
                sampleRate: 16000,
                channels: 1,
                bitsPerSample: 16,
                audioSource: 6,
                wavFile: `${new Date().getTime()}.wav`
            };
            await AudioRecord.init(options);
            this.record = AudioRecord.start();
            this.timeOute = setTimeout(async ()=>{
                await this.startRecording()
            },30000)
        }
        this.setState({
            recording: !this.state.recording
        })
    };

    deleteRecording = ()=>{
        if(DeviceInfo.ios){
            Alert.alert(
                "Are you sure you want to \npermanently delete the \ngreeting?",
                "",
                [
                    {
                        text: 'Cancel',
                        onPress: () => {}
                    },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            this.setState({
                                loaderVisible: true
                            });

                            this.props.makeAction(DELETE_VOICEMAIL_GREETING,{
                                callback: ()=>{
                                    if(this.sound){
                                        this.sound.release();
                                    }
                                    this.props.navigation.goBack();
                                    if(this.props.route.params && this.props.route.params.getData){
                                        this.props.route.params.getData()
                                    }
                                },
                                error: ()=>{
                                    this.setState({
                                        loaderVisible: false
                                    })
                                },
                                name: this.props.route.params.item.name,
                                isEnabled: this.props.route.params.item.isEnabled
                            })
                        }
                    }
                ]
            );
        }else {
            this.androidAlertDialog.openDialog({
                title: 'Are you sure you want to permanently delete the greeting?',
                body: '',
                buttons: [{
                    title: 'CANCEL',
                    onPress: ()=>{}
                },{
                    title: 'DELETE',
                    wrong: true,
                    onPress: ()=>{
                        this.setState({
                            loaderVisible: true
                        });

                        this.props.makeAction(DELETE_VOICEMAIL_GREETING,{
                            callback: ()=>{
                                if(this.sound){
                                    this.sound.release();
                                }
                                this.props.navigation.goBack();
                                if(this.props.route.params && this.props.route.params.getData){
                                    this.props.route.params.getData()
                                }
                            },
                            error: ()=>{
                                this.setState({
                                    loaderVisible: false
                                })
                            },
                            name: this.props.route.params.item.name,
                            isEnabled: this.props.route.params.item.isEnabled
                        })
                    }
                }]
            })
        }
    };

    changeName = (text)=>{
        this.setState({
            name: text
        })
    };

    playPause = ()=>{
        if(this.sound){
            if(this.state.played){
                this.stopTimeLineUpdate();
                this.setState({
                    played: false
                },()=>{
                    this.sound.pause()
                })
            }else {
                this.startTimeLineUpdate();
                this.setState({
                    played: true
                },()=>{
                    this.sound.play(this.onEnd)
                })
            }
        }
    };

    calculateDuration = (duration)=>{
        let minutes = duration/60;
        minutes = minutes>1?minutes:0;
        let seconds = duration-(minutes*60);
        return `${minutes<10?`0${minutes}`:minutes}:${seconds<10?`0${seconds}`:seconds}`
    };

    startTimeLineUpdate = ()=>{
        if(this.sound){
            if(this.timeLineUpdate){
                clearInterval(this.timeLineUpdate)
            }
            this.timeLineUpdate = setInterval(()=>{
                this.sound.getCurrentTime((seconds) => {
                    this.setState({
                        progress: seconds/this.state.duration
                    })
                });
            },100);
        }
    };

    stopTimeLineUpdate = async (cb)=>{
        if(this.timeLineUpdate){
            await clearInterval(this.timeLineUpdate);
            if(cb){
                setTimeout(()=>{
                    cb();
                },0)
            }
        }
    };

    render() {
        const {loaderVisible, newGreeting, recording, name, audioFile, played, progress, duration, oldName} = this.state;
        const {navigation} = this.props;

        return(
            <View style={styles.screen}>
                {loaderVisible?<ScreenLoader/>:null}
                <AndroidAlertDialog ref={ref => this.androidAlertDialog = ref}/>
                <View style={styles.headerContainer}>
                    {newGreeting?<TabScreenHeader
                        title={'Create Greeting'}
                        leftIcon={DeviceInfo.ios?'cancel':'cancelIcon'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                        rightIcon={'save'}
                        rightIconPress={this.save}
                        rightIconColor={!name || !audioFile || name === oldName?iconsColors.arrow:''}
                        rightDisabled={!name || !audioFile}
                    />:<TabScreenHeader
                        title={'Edit Greeting'}
                        leftIcon={DeviceInfo.ios?'cancel':'cancelIcon'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                        rightIcon={'save'}
                        rightIconPress={this.save}
                        rightIconColor={!name || name === oldName?iconsColors.arrow:''}
                        rightDisabled={!name || name === oldName}
                    />}
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            placeholder={'Name*'}
                            onChangeText={(text) => this.changeName(text)}
                            placeholderTextColor={iconsColors.gray}
                            maxLength={30}
                        />
                    </View>
                    <View style={styles.playerContainer}>
                        <TouchableOpacity style={styles.playButton} disabled={!audioFile} onPress={this.playPause}>
                            {played?<Pause width={sizes.size32} height={sizes.size32} />
                            :<Play width={sizes.size32} height={sizes.size32} />}
                        </TouchableOpacity>
                        <View style={styles.progressBarrContainer}>
                            <Progress.Bar
                                progress={progress}
                                width={sizes.size267}
                                height={sizes.size3}
                                borderWidth={0}
                                color={Colors.appColor1}
                                unfilledColor={Colors.grayBorder}
                            />
                        </View>
                        <Text style={styles.durationText}>{this.calculateDuration(duration)}</Text>
                    </View>
                </View>
                {newGreeting?<TouchableOpacity style={[styles.startRecordingButton]} onPress={audioFile?this.reRecording:this.checkMicrophone}>
                    {audioFile?<Text style={[styles.startRecordingButtonText,DeviceInfo.android?styles.startRecordingButtonTextAndroid:null]}>{DeviceInfo.ios?'Re-record Greeting':'RE-RECORD GREETING'}</Text>
                        :<Text style={[styles.startRecordingButtonText,DeviceInfo.android?styles.startRecordingButtonTextAndroid:null]}>{recording?DeviceInfo.ios?'Stop Recording':'STOP RECORDING':DeviceInfo.ios?'Start Recording':'START RECORDING'}</Text>}
                </TouchableOpacity>:null}
                {!newGreeting?<TouchableOpacity style={[styles.startRecordingButton,DeviceInfo.android?styles.startRecordingButtonTextAndroid:null]} onPress={this.deleteRecording}>
                    <Text style={[styles.startRecordingButtonText,DeviceInfo.android?styles.startRecordingButtonTextAndroid:null,{color: Colors.wrong}]}>{DeviceInfo.ios?'Delete Recording':'DELETE RECORDING'}</Text>
                </TouchableOpacity>:null}
            </View>
        )
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(EditGreeting)
