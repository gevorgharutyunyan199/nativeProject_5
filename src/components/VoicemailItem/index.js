import React, {Component} from 'react';
import {View, TouchableOpacity, TouchableWithoutFeedback, Text, Animated, Easing, ActivityIndicator, Alert} from 'react-native';
import styles from './styles';
import {sizes} from "../../assets/sizes";
import {Play, Pause, SpeakerOn, ControlCall, ControlDelete, SpeakerOff} from '../../assets/icons';
import * as Progress from 'react-native-progress';
import {Colors} from "../../assets/RootStyles";
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import {
    MARK_VOICEMAIL,
    GET_VOICEMAIL_BY_ID,
    DELETE_VOICEMAIL,
    GET_BADGES
} from '../../actionsTypes';
import moment from 'moment';
import ValidationService from "../../services/ValidationService";

class VoicemailItem extends Component{

    state = {
        height: new Animated.Value(sizes.size65),
        opened: false,
        played: false,
        playerLoader: false,
        progress: 0
    };

    showContent = () => {
        const {data, makeAction, index} = this.props;

        if(!data.read){
            makeAction(MARK_VOICEMAIL,{
                id: data.id,
                index: index,
                callback: ()=>{
                    makeAction(GET_BADGES);
                },
                error: ()=>{}
            });
        }

        if(this.state.opened){
            this.closePlayer();
            this.stopTimeLineUpdate();
            this.setState({
                opened: false
            },()=>{
                Animated.timing(this.state.height, {
                    toValue: sizes.size65,
                    duration: 100,
                    easing: Easing.linear,
                    useNativeDriver: false
                }).start();
            });
        }else {
            if(!data.content){
                this.setState({
                    playerLoader: true
                });
                makeAction(GET_VOICEMAIL_BY_ID,{
                    id: data.id,
                    index: index,
                    callback: (content)=>{
                        this.saveContent(content)
                    },
                    error: ()=>{}
                });
            }else {
                this.saveContent(data.content)
            }
            this.props.closeItemVoicemai();
            Animated.timing(this.state.height, {
                toValue: sizes.size182,
                duration: 100,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(async ()=>{
                this.props.itemPress();
                await this.setState({
                    opened: true
                });
            });
        }
    };

    saveContent = (base64)=>{
        const path = `${RNFS.DocumentDirectoryPath}/${this.props.data.id}.wav`;
        RNFS.writeFile(path, base64, 'base64').then(() => {
            Sound.setCategory('Playback');
            this.sound = new Sound(`${this.props.data.id}.wav`, `${RNFS.DocumentDirectoryPath}/`, () => {
                if(this.props.speakerOn){
                    this.sound.setVolume(1)
                }else {
                    this.sound.setVolume(0)
                }
                this.setState({
                    playerLoader: false
                });
            });
        });
    };

    startTimeLineUpdate = ()=>{
        if(this.sound){
            if(this.timeLineUpdate){
                clearInterval(this.timeLineUpdate)
            }
            this.timeLineUpdate = setInterval(()=>{
                this.sound.getCurrentTime((seconds) => {
                    this.setState({
                        progress: seconds*1000/this.props.data.duration
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

    onEnd = ()=>{
        this.stopTimeLineUpdate(()=>{
            this.setState({
                played: false,
                progress: 1
            });
        });
    };

    closePlayer = ()=>{
        this.stopTimeLineUpdate();
        this.setState({
            played: false,
            progress: 0
        });
        if(this.sound){
            this.sound.release();
        }
    };

    closeContent = ()=>{
        this.closePlayer();
        this.setState({
            opened: false
        });
        Animated.timing(this.state.height, {
            toValue: sizes.size65,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false
        }).start();
    };

    convertDate = (date)=>{
        const formatDate = 'YYYY-MM-DD';
        const getDay = (date) => {
            if (date)
                return moment(date).format(formatDate);
            else
                return moment().format(formatDate)
        };
        const today = moment(getDay(), formatDate).startOf('day');
        const oldDate = moment(getDay(date), formatDate);
        if (today.diff(oldDate, 'day') < 1) {
            return 'Today'
        } else if (today.diff(oldDate, 'day') < 2) {
            return 'Yesterday'
        } else if (today.diff(oldDate, 'day') < 3) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 4) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 5) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 6) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 7) {
            return oldDate.format('dddd');
        } else {
            return oldDate.format('MM.DD.YY');
        }
    };

    convertDuration = (duration)=>{
        let time = (Math.floor(duration / 1000));
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        return `${minutes<10?`0${minutes}`:minutes}:${seconds<10?`0${seconds}`:seconds}`
    };

    getTime = (date)=>{
        return moment(date).format('hh:mm a').toUpperCase();
    };

    mutePress = ()=>{
        if(this.props.speakerOn){
            if(this.sound){
                this.sound.setVolume(0)
            }
        }else {
            if(this.sound){
                this.sound.setVolume(1)
            }
        }
        this.props.mutePress()

    };

    call = ()=>{
        this.pause();
        this.props.call()
    };

    pause = ()=>{
        if(this.sound){
            this.stopTimeLineUpdate();
            this.setState({
                played: false
            },()=>{
                this.sound.pause()
            })
        }
    };

    deleteVoicemail = ()=>{
        const {data, index, makeAction} = this.props;
        this.pause();
        Alert.alert(
            "Are you sure you want to \npermanently delete the \nvoicemail?",
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
                        this.props.setLoaderVisibleVoicemail(true);
                        this.props.deleteVoicemail();
                        makeAction(DELETE_VOICEMAIL,{
                            id: data.id,
                            index: index,
                            callback: ()=>{
                                this.props.setLoaderVisibleVoicemail(false);
                            },
                            error: ()=>{
                                this.props.setLoaderVisibleVoicemail(false);
                            }
                        })
                    }
                }
            ]
        );
    };

    render() {
        const { height, opened, played, playerLoader, progress} = this.state;
        const { data, speakerOn} = this.props;
        let name = '';
        let duration = this.convertDuration(data.duration);
        if(data.contact){
            name = data.contact.givenName || data.contact.familyName?`${data.contact.givenName?data.contact.givenName+' ':''}${data.contact.familyName?data.contact.familyName:''}`:`${ValidationService.parsePhoneNumber(data.phoneNumber)}`
        }else{
            name = ValidationService.parsePhoneNumber(data.phoneNumber);
        }
        return(
            <Animated.View  style={[{height: height},styles.itemContainer]}>
                <TouchableWithoutFeedback onPress={()=>{this.showContent()}}>
                    <View style={styles.itemTopContainer}>
                        <View style={[styles.row,styles.flexBetween]}>
                            <View style={styles.row}>
                                <View style={styles.ovalContainer}>
                                    {!data.read?<View style={styles.oval}/>:null}
                                </View>
                                <Text style={styles.title}>{name}</Text>
                            </View>
                            <Text style={styles.day}>{this.convertDate(new Date(data.createdDate))}</Text>
                        </View>
                        <View style={[styles.row,styles.flexBetween,styles.durationContainer]}>
                            <Text style={styles.durationText}>Duration {duration}</Text>
                            <Text style={styles.day}>{this.getTime(new Date(data.createdDate))}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {opened?<View style={styles.playerContainer}>
                    <TouchableOpacity disabled={playerLoader} onPress={this.playPause}>
                        {playerLoader?<View style={styles.playerLoaderContainer}><ActivityIndicator size={'small'} color={Colors.activeBullet}/></View>
                        :played?<Pause width={sizes.size32} height={sizes.size32} />
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
                    <Text style={styles.playerSec}>{duration}</Text>
                </View>:null}
                {opened?<View style={styles.controlsContainer}>
                    <TouchableOpacity style={styles.controlsItem} onPress={this.mutePress}>
                        {speakerOn?<SpeakerOn width={sizes.size35} height={sizes.size35} />
                        :<SpeakerOff width={sizes.size35} height={sizes.size35} />}
                        <Text style={styles.controlsItemTitle}>Speaker</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlsItem} onPress={this.call}>
                        <ControlCall width={sizes.size35} height={sizes.size35} />
                        <Text style={styles.controlsItemTitle}>Call back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlsItem} onPress={this.deleteVoicemail}>
                        <ControlDelete width={sizes.size35} height={sizes.size35} />
                        <Text style={styles.controlsItemTitle}>Delete</Text>
                    </TouchableOpacity>
                </View>:null}
            </Animated.View>
        )
    }
}

export {VoicemailItem}
