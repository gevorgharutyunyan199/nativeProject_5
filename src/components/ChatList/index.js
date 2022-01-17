import React, {Component} from 'react';
import {ActivityIndicator, FlatList, View, Modal, TouchableWithoutFeedback, Text, TouchableOpacity, Keyboard} from 'react-native';
import {Divider, ChatListMessageContent, ChatListVideoContent, ChatListImageContent} from "../../components";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import styles from "./styles";
import {Colors} from "../../assets/RootStyles";
import moment from 'moment';
import {
    CHANGE_LAST_SEEN_TIME,
    DELETE_MESSAGE,
    GET_BADGES,
    GET_MESSAGES,
    GET_PRIVATE_CHAT,
    SET_ACTIVE_CHAT_ID,
    SET_ACTIVE_CHAT_LIST_DATA
} from "../../actionsTypes";

class ChatList extends Component {

    state = {
        orderedNumber: '',
        page: 1,
        scrollEnabled: true,
        loadingMore: false,
        loading: false,
        androidActionModalVisible: false,
        actionModalSelectedItem: {}
    }

    playedVideoElementIndex = -1;

    async componentDidMount() {
        let currentUser = await AsyncStorage.getItem('currentUser');
        if(!this.props.chat){
            this.props.makeAction(GET_PRIVATE_CHAT,{
                callback: (data)=>{
                    if(data.id){
                        this.props.makeAction(SET_ACTIVE_CHAT_ID,data.id);
                        this.props.makeAction(CHANGE_LAST_SEEN_TIME,{
                            callback: ()=>{
                                this.props.makeAction(GET_BADGES);
                            },
                            error: ()=>{},
                            chatId: data.id
                        });
                        this.setState({
                            chat: data,
                            orderedNumber: JSON.parse(currentUser).orderedNumbers[0]
                        },()=>{
                            this.getMessages()
                        })
                    }
                },
                error: ()=>{},
                to: this.props.number
            });
        }else {
            if(this.props.chat.id){
                this.props.makeAction(SET_ACTIVE_CHAT_ID,this.props.chat.id);
                this.props.makeAction(CHANGE_LAST_SEEN_TIME,{
                    callback: ()=>{
                        this.props.makeAction(GET_BADGES);
                    },
                    error: ()=>{},
                    chatId: this.props.chat.id
                });
            }
            this.setState({
                chat: this.props.chat,
                orderedNumber: JSON.parse(currentUser).orderedNumbers[0]
            },()=>{
                this.getMessages()
            })
        }
    }

    componentWillUnmount() {
        if(this.props.userInfo.inAppNotificationData.chat){
            return
        }
        this.props.makeAction(SET_ACTIVE_CHAT_ID,'');
        this.props.makeAction(SET_ACTIVE_CHAT_LIST_DATA, []);
    }

    isUser = (from) => {
        const {orderedNumber} = this.state;
        return from === orderedNumber
    };

    showDivider = (index)=>{
        const {listData} = this.props.chatData;
        let getDeyNew = new Date(listData[index].createdDate).getDay();
        let getMonthNew = new Date(listData[index].createdDate).getMonth();
        let getFullYearNew = new Date(listData[index].createdDate).getFullYear();
        let oldDey = new Date(listData[index+1].createdDate).getDay();
        let oldMonth = new Date(listData[index+1].createdDate).getMonth();
        let getOldFullYear = new Date(listData[index+1].createdDate).getFullYear();

        return `${getDeyNew}${getMonthNew}${getFullYearNew}` !== `${oldDey}${oldMonth}${getOldFullYear}`;
    };

    convertDate = (date) => {
        return moment(date).format('hh:mm a').toUpperCase();
    };
    convertDateDivider = (date) => {
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

    getMessages = ()=>{
        const {makeAction} =  this.props;
        const {page} =  this.state;

        this.setState({
            loading: true
        });

        makeAction(GET_MESSAGES,{
            callback: ()=>{
                try {
                    this.setState({
                        refreshing: false,
                        loading: false
                    })
                }catch (e){
                    console.log(e)
                }
            },
            error: ()=>{
                this.setState({
                    refreshing: false,
                    loading: false
                })
            },
            page: page
        });
    }

    loadMore = (e)=>{
        const {page,loadingMore,scrollEnabled} = this.state;
        const {makeAction,chatData} = this.props;
        if(e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height-0.1){
            if(!loadingMore && scrollEnabled && chatData.listData.length>39){
                this.setState({
                    loadingMore: true,
                    page: page+1,
                },()=>{
                    setTimeout(()=>{
                        makeAction(GET_MESSAGES,
                            {
                                loadMore: true,
                                messageId: chatData.listData[chatData.listData.length-1].id,
                                callback: ()=>{
                                    this.setState({
                                        loadingMore: false
                                    })
                                },
                                disableLoadMore: ()=>{
                                    this.setState({
                                        scrollEnabled: false
                                    })
                                },
                                error: ()=>{
                                    this.setState({
                                        loadingMore: false
                                    })
                                },
                            }
                        )
                    },500);
                })
            }
        }
    };

    tryAgain = (item)=>{
        this.props.send({
            type: item.messageType,
            content: item.content
        },item.id)
    }

    deleteMessage = (item)=>{
        this.props.makeAction(DELETE_MESSAGE, {
            id: item.id,
            callback: ()=>{},
            error: ()=>{}
        })
    }

    videoPlayPause = (index)=>{
        if(this.playedVideoElementIndex === -1){
            this.playedVideoElementIndex = index
        }else {
            if(this.playedVideoElementIndex === index){
                this.playedVideoElementIndex = -1
            }else {
                if(this[`videoMessage${this.playedVideoElementIndex}`]){
                    this[`videoMessage${this.playedVideoElementIndex}`].pose();
                }
                this.playedVideoElementIndex = index;
            }
        }
    }

    setActionModalSelectedItem = (item)=>{
        this.setState({
            actionModalSelectedItem: item
        })
    }

    renderItemChatList = (item, index) => {
        const {listData} = this.props.chatData;
        let smallMargin = false;

        if((listData[index+1] && item.from === listData[index+1].from) || (listData[index-1] && item.from === listData[index-1].from)){
            smallMargin = true
        }

        const handleMessageType = (type) => {
            switch (type) {
                case 'Video':
                    return <ChatListVideoContent
                        ref={(elem)=>{this[`videoMessage${index}`] = elem}}
                        contact={this.state.chat?this.state.chat.contact:{}}
                        convertDate={this.convertDate}
                        isUser={this.isUser}
                        item={item}
                        tryAgain={()=>{this.tryAgain(item)}}
                        deleteMessage={()=>{this.deleteMessage(item)}}
                        index={index}
                        videoPlayPause={this.videoPlayPause}
                        openAndroidActionModal={this.openAndroidActionModal}
                        setActionModalSelectedItem={this.setActionModalSelectedItem}
                        smallMargin={smallMargin}
                    />;
                case 'Image':
                    return <ChatListImageContent
                        contact={this.state.chat?this.state.chat.contact:{}}
                        convertDate={this.convertDate}
                        isUser={this.isUser}
                        item={item}
                        tryAgain={()=>{this.tryAgain(item)}}
                        deleteMessage={()=>{this.deleteMessage(item)}}
                        openAndroidActionModal={this.openAndroidActionModal}
                        setActionModalSelectedItem={this.setActionModalSelectedItem}
                        smallMargin={smallMargin}
                    />;
                case 'Text':
                    return <ChatListMessageContent
                        contact={this.state.chat?this.state.chat.contact:{}}
                        convertDate={this.convertDate}
                        isUser={this.isUser}
                        item={item}
                        tryAgain={()=>{this.tryAgain(item)}}
                        deleteMessage={()=>{this.deleteMessage(item)}}
                        openAndroidActionModal={this.openAndroidActionModal}
                        setActionModalSelectedItem={this.setActionModalSelectedItem}
                        smallMargin={smallMargin}
                    />;
                default:
                    break
            }
        };

        if(!listData[index+1]){
            return (
                <>
                    {handleMessageType(item.messageType)}
                    {<Divider text={this.convertDateDivider(new Date(item.createdDate))}/>}
                </>
            )
        }

        return (
            <>
                {handleMessageType(item.messageType)}
                {listData[index+1] && this.showDivider(index)?<Divider text={this.convertDateDivider(new Date(item.createdDate))}/>:null}
            </>
        )
    };

    openAndroidActionModal = ()=>{
        this.setState({
            androidActionModalVisible: true
        })
    };

    closeAndroidActionModal = ()=>{
        this.setState({
            androidActionModalVisible: false
        })
    };

    render() {
        const {chatData} = this.props;
        const {loadingMore,orderedNumber,loading,androidActionModalVisible,actionModalSelectedItem} = this.state;

        return (
            orderedNumber?<View style={styles.content}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={androidActionModalVisible}
                >
                    <TouchableWithoutFeedback onPress={this.closeAndroidActionModal}>
                        <View style={[styles.androidMenu]}>
                            <View style={styles.bottomSheetContainer}>
                                <View style={styles.bottomSheetHeader}>
                                    <View style={styles.lineContainer}>
                                        <View style={styles.line}/>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.button} onPress={()=>{
                                    this.closeAndroidActionModal();
                                    this.tryAgain(actionModalSelectedItem)
                                }}>
                                    <Text style={styles.buttonText}>Try Again</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={()=>{
                                    this.closeAndroidActionModal();
                                    this.deleteMessage(actionModalSelectedItem)
                                }}>
                                    <Text style={[styles.buttonText, {color: Colors.wrong}]}>Delete Message</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={this.closeAndroidActionModal}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <FlatList
                    data={chatData.listData}
                    renderItem={({item, index}) => {
                        return this.renderItemChatList(item, index)
                    }}
                    onScroll={({nativeEvent}) => {
                        Keyboard.dismiss();
                        this.loadMore({nativeEvent})
                    }}
                    inverted={true}
                    keyExtractor={(item, index)=>index.toString()}
                    ListFooterComponent={loadingMore && <View style={styles.listFooter}>
                        <ActivityIndicator size={'small'} color={Colors.activeBullet}/>
                    </View>}
                    ListEmptyComponent={loading?<View style={styles.emptyListContainer}>
                        <ActivityIndicator size={'small'} color={Colors.grayText}/>
                    </View>:null}
                />
            </View>:null
        )
    }
}


const mapStateToProps = store =>{
    return {
        chatData: store.ChatReducer,
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(ChatList)
