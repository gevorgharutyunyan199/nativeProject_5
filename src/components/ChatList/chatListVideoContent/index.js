import React, {Component} from 'react';
import {ActivityIndicator, Image, Modal, Text, TouchableOpacity, View, TouchableWithoutFeedback} from 'react-native';
import styles from './styles';
import Video from 'react-native-video';
import {PauseVideo, PlayVideo} from "../../../assets/icons";
import {sizes} from "../../../assets/sizes";
import {ChatListActionSheet, Preview, SenderAvatar} from "../../../components";
import {Colors} from "../../../assets/RootStyles";
import {DeviceInfo} from "../../../assets/DeviceInfo";

class ChatListVideoContent extends Component {

    state = {
        videoLoader: true,
        played: false,
        modalVisible: false
    }

    hideModal = ()=>{
        this.setState({
            modalVisible: false
        })
    }

    playPose = () => {
        this.setState({
            played: !this.state.played
        });
        this.props.videoPlayPause(this.props.index);
    }

    pose = ()=>{
        this.setState({
            played: false
        });
    }

    render() {
        const {modalVisible} = this.state;
        let file = {
            camera: true,
            name: new Date().getTime(),
            size: null,
            type: "video",
            uri: this.props.item.content
        };

        return (
            <View style={[
                styles.contentContainer,
                this.props.isUser(this.props.item.from) ? styles.justifyEnd : styles.justifyStart,
                this.props.isUser(this.props.item.from) && !this.props.item.isSent? {alignItems: 'center'} : null,
                this.props.smallMargin?styles.senderContainerSmallMargin:null
            ]}>
                <SenderAvatar contact={this.props.contact} isUser={this.props.isUser} item={this.props.item}/>
                    {this.props.isUser(this.props.item.from) && !this.props.item.isSent?<TouchableOpacity onPress={()=>{
                        if(this.state.played){
                            this.playPose();
                        }
                        if(DeviceInfo.ios){
                            ChatListActionSheet(this.props.tryAgain,this.props.deleteMessage,() => {})
                        }else {
                            this.props.setActionModalSelectedItem(this.props.item);
                            this.props.openAndroidActionModal()
                        }
                    }
                }>
                    <Image style={styles.errorIcon} source={require('../../../assets/images/error-messages.png')}/>
                </TouchableOpacity>:null}
                <TouchableWithoutFeedback onPress={()=>{
                    this.playPose();
                    this.pose();
                    this.setState({
                        modalVisible: true
                    })
                }}>
                    <View style={[styles.videoContainer, this.props.isUser(this.props.item.from) && !this.props.item.isSent?styles.statusError:null]}>
                        <Video
                            source={{uri: this.props.item.content,cache: { expiresIn: 3600 }}}
                            style={styles.backgroundVideo}
                            paused={!this.state.played}
                            repeat={DeviceInfo.ios}
                            resizeMode={'cover'}
                            onEnd={() => {
                                this.setState({
                                    played: false
                                })
                            }}
                            ignoreSilentSwitch={"ignore"}
                            onLoad={()=>{
                                if(DeviceInfo.android){
                                    this.setState({
                                        played: true
                                    },()=>{
                                        this.setState({
                                            played: false
                                        });
                                    });
                                }
                                this.setState({
                                    videoLoader: false
                                })
                            }}
                        />
                        {this.state.videoLoader?<View style={[styles.loaderContainer]}>
                            <ActivityIndicator size={'small'} color={Colors.white}/>
                        </View>:null}
                        {!this.state.videoLoader?<Text style={styles.videoData}>{this.props.convertDate(new Date(this.props.item.createdDate))}</Text>:null}
                        {!this.state.videoLoader?<TouchableOpacity style={styles.playButton} onPress={this.playPose}>
                            {this.state.played ? <PauseVideo width={sizes.size69} height={sizes.size69}/>
                                : <PlayVideo width={sizes.size69} height={sizes.size69}/>}
                        </TouchableOpacity>:null}
                    </View>
                </TouchableWithoutFeedback>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                >
                    <Preview
                        file={file}
                        hideModal={this.hideModal}
                        onlyShow={true}
                    />
                </Modal>
            </View>
        )
    }
}

export {ChatListVideoContent};

