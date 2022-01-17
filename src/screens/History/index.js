import React, {Component} from 'react';
import {View, Text, FlatList, RefreshControl, Image, ActivityIndicator, AppState} from 'react-native';
import {TabScreenHeader, ScreenLoader, TabBarr, HistoryListItem} from '../../components';
import styles from './styles';
import AlertService from '../../services/AlertService';
import {Colors} from "../../assets/RootStyles";
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {VoicemailItem} from '../../components';
import CallDetectorManager from 'react-native-call-detection';
import {
    GENERATE_OUTGOING_CALL_NUMBER,
    GET_BADGES,
    GET_CALL_HISTORY,
    GET_VOICEMAILS,
    SET_SCROLL_REF,
    SET_HISTORY_DATA_LOAD_SCREEN
} from '../../actionsTypes';

class History extends Component {

    state = {
        activeTab: 1,
        page: 1,
        loaderVisible: true,
        callLoaderVisible: false,
        scrollEnabled: true,
        refreshing: false,
        loadingMore: false,
        loading: false,
        pageVoicemail: 1,
        loaderVisibleVoicemail: true,
        loaderVisibleDeleteVoicemail: false,
        scrollEnabledVoicemail: true,
        refreshingVoicemail: false,
        loadingMoreVoicemail: false,
        loadingVoicemail: false,
        openedVoicemailItem: null,
        speakerOn: true
    };

    voicemailItems = [];

    componentDidMount() {
        if(this.props.tabSelected === 2){
            this.tabPress(2)
        }
        this.props.makeAction(SET_HISTORY_DATA_LOAD_SCREEN,this.props.mediaUi?'Media':'Tab');

        this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
            if(this.props.userInfo.historyDataLoadScreen !== 'Tab'){
                this.getHistory();
                this.getVoicemails();
            }
            this.props.makeAction(SET_HISTORY_DATA_LOAD_SCREEN,this.props.mediaUi?'Media':'Tab');
            this.props.makeAction(SET_SCROLL_REF,this.state.activeTab === 1?this.scrollRef1:this.scrollRef2);
            if(this.props.userInfo.inAppNotificationData.type === 'voicemail'){
                this.tabPress(2)
            }else if(this.props.userInfo.inAppNotificationData.type === 'missed'){
                this.tabPress(1)
            }
            this.props.makeAction(GET_BADGES);
        });

        this.navigationListenerBlur = this.props.navigation.addListener('blur', async () => {
            this.closeItemVoicemai(this.state.openedVoicemailItem);
        });

        this.callDetector = new CallDetectorManager((event)=> {
                if (event === 'Disconnected') {
                    if(this.props.mediaUi){
                        this.getHistory(true);
                        this.setState({
                            loaderVisible: false,
                            loaderVisibleVoicemail: false
                        })
                    }else {
                        this.getHistory(true);
                    }
                }
            },
            {
                title: 'Phone State Permission',
                message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
            }
        );

        if(this.props.mediaUi){
            if(this.props.tabSelected === 2){
                this.getVoicemails();
                this.setState({loaderVisible: false})
            }else {
                this.getHistory();
                this.setState({loaderVisibleVoicemail: false})
            }
        }else {
            this.getHistory();
            this.getVoicemails();
        }
        AppState.addEventListener('change',this._stateChange);
    }

    componentWillUnmount() {
        if(this.navigationListenerBlur && this.navigationListenerBlur.remove){
            this.navigationListenerBlur.remove()
        }
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove()
        }
        AppState.removeEventListener('change',this._stateChange);
        if(this.callDetector && this.callDetector.dispose){
            this.callDetector.dispose()
        }
    }

    _stateChange = (state)=>{
        const {makeAction,filterNumber} =  this.props;
        if(state === 'active'){
            this.setInitialState();
            this.setInitialStateVoicemail();
            makeAction(GET_CALL_HISTORY,{
                callback: ()=>{},
                error: ()=>{},
                page: 1,
                PhoneNumbers: [filterNumber]
            });
            makeAction(GET_VOICEMAILS,{
                callback: ()=>{},
                error: ()=>{},
                page: 1,
                PhoneNumbers: [filterNumber]
            });
        }
    };

    getHistory = (skipLoader = false)=>{
        const {makeAction,filterNumber} =  this.props;
        const {page,loaderVisible} =  this.state;
        if(!loaderVisible && !skipLoader){
            this.setState({
                loaderVisible: true
            });
        }
        makeAction(GET_CALL_HISTORY,{
            callback: ()=>{
                try {
                    this.setState({
                        loaderVisible: false,
                        refreshing: false
                    })
                }catch (e){
                    console.log(e)
                }
            },
            error: ()=>{
                this.setState({
                    loaderVisible: false,
                    refreshing: false
                })
            },
            page: page,
            PhoneNumbers: [filterNumber]
        });
    };

    getVoicemails = ()=>{
        const {makeAction,filterNumber} =  this.props;
        const {pageVoicemail,loaderVisibleVoicemail} =  this.state;
        if(!loaderVisibleVoicemail){
            this.setState({
                loaderVisibleVoicemail: true
            });
        }
        makeAction(GET_VOICEMAILS,{
            callback: ()=>{
                try {
                    this.setState({
                        loaderVisibleVoicemail: false,
                        loaderVisibleDeleteVoicemail: false,
                        refreshingVoicemail: false
                    })
                }catch (e){
                    console.log(e)
                }
            },
            error: ()=>{
                this.setState({
                    loaderVisibleVoicemail: false,
                    refreshingVoicemail: false
                })
            },
            page: pageVoicemail,
            PhoneNumbers: [filterNumber]
        });
    };

    tabPress = (active)=>{
        const {activeTab} = this.state;
        if(active === activeTab){
            return
        }
        this.closeItemVoicemai(this.state.openedVoicemailItem);
        this.setState({
            activeTab: active
        },()=>{
            this.props.makeAction(SET_SCROLL_REF,this.state.activeTab === 1?this.scrollRef1:this.scrollRef2);
        })
    };

    refreshList = ()=>{
        const {activeTab,refreshing} = this.state;
        const {makeAction,filterNumber} = this.props;

        if(!refreshing){
            this.setInitialState();
            this.setState({
                refreshing: true
            });
            if(activeTab === 1) {
                makeAction(GET_CALL_HISTORY,{
                    callback: ()=>{
                        try {
                            this.setState({
                                loaderVisible: false,
                                refreshing: false
                            })
                        }catch (e){
                            console.log(e)
                        }
                    },
                    error: ()=>{
                        this.setState({
                            loaderVisible: false,
                            refreshing: false
                        })
                    },
                    page: 1,
                    PhoneNumbers: [filterNumber]
                });
            }
        }
    };

    refreshListVoicemail = ()=>{
        const {activeTab,refreshingVoicemail} = this.state;
        const {makeAction,filterNumber} = this.props;

        if(!refreshingVoicemail){
            this.closeItemVoicemai(this.state.openedVoicemailItem);
            this.setInitialStateVoicemail();
            this.setState({
                refreshingVoicemail: true
            });
            if(activeTab === 2) {
                makeAction(GET_VOICEMAILS,{
                    callback: ()=>{
                        try {
                            this.setState({
                                loaderVisibleVoicemail: false,
                                refreshingVoicemail: false
                            })
                        }catch (e){
                            console.log(e)
                        }
                    },
                    error: ()=>{
                        this.setState({
                            loaderVisibleVoicemail: false,
                            refreshingVoicemail: false
                        })
                    },
                    page: 1,
                    PhoneNumbers: [filterNumber]
                });
            }
        }
    };

    setInitialState = ()=>{
        this.setState({
            loadingMore: false,
            page: 1,
            scrollEnabled: true
        })
    };

    setInitialStateVoicemail = ()=>{
        this.setState({
            loadingMoreVoicemail: false,
            pageVoicemail: 1,
            scrollEnabledVoicemail: true
        })
    };

    listItemInfoPress = (item,index)=>{
        const {navigation,makeAction,filterNumber} = this.props;

        navigation.navigate('ContactDetails',{
            index:  index,
            number: item.phoneNumber,
            id: item.contact?item.contact.id:null,
            getContacts: ()=>{
                this.setInitialState();
                makeAction(GET_CALL_HISTORY,{
                    callback: ()=>{
                        try {
                            this.setState({
                                loaderVisible: false,
                                refreshing: false
                            })
                        }catch (e){
                            console.log(e)
                        }
                    },
                    error: ()=>{
                        this.setState({
                            loaderVisible: false,
                            refreshing: false
                        })
                    },
                    page: 1,
                    PhoneNumbers: [filterNumber]
                });
            },
            unknownNumber: !item.contact ?item:null,
            rootScreen: 'History'
        })
    };

    loadMore = (e)=>{
        const {page,loadingMore,scrollEnabled} = this.state;
        const {makeAction,userInfo,filterNumber} = this.props;
        if(e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height-0.1){
            if(!loadingMore && scrollEnabled && userInfo.callHistory.length>39){
                this.setState({
                    loadingMore: true,
                    page: page+1,
                },()=>{
                    setTimeout(()=>{
                        makeAction(GET_CALL_HISTORY,
                            {
                                page: this.state.page,
                                PhoneNumbers: [filterNumber],
                                loadMore: true,
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

    loadMoreVoicemail = (e)=>{
        const {pageVoicemail,loadingMoreVoicemail,scrollEnabledVoicemail} = this.state;
        const {makeAction,userInfo,filterNumber} = this.props;
        if(e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height-0.1){
            if(!loadingMoreVoicemail && scrollEnabledVoicemail && userInfo.voicemails.length>39){
                this.closeItemVoicemai(this.state.openedVoicemailItem);
                this.setState({
                    loadingMoreVoicemail: true,
                    pageVoicemail: pageVoicemail+1,
                },()=>{
                    setTimeout(()=>{
                        makeAction(GET_VOICEMAILS,
                            {
                                page: this.state.pageVoicemail,
                                PhoneNumbers: [filterNumber],
                                loadMore: true,
                                callback: ()=>{
                                    this.setState({
                                        loadingMoreVoicemail: false
                                    })
                                },
                                disableLoadMore: ()=>{
                                    this.setState({
                                        scrollEnabledVoicemail: false
                                    })
                                },
                                error: ()=>{
                                    this.setState({
                                        loadingMoreVoicemail: false
                                    })
                                },
                            }
                        )
                    },500);
                })
            }
        }
    };

    call = async (number)=>{
        this.setState({
            callLoaderVisible: true
        });
        this.props.makeAction(GENERATE_OUTGOING_CALL_NUMBER,{
            callback: async (data)=>{
                this.setState({
                    callLoaderVisible: false
                });
                await AlertService.call(data.imrn);
            },
            error: ()=>{
                this.setState({
                    callLoaderVisible: false
                })
            },
            number: number
        });
    };

    renderItem = (item,index)=>{
        return <HistoryListItem
            item={item}
            infoPress={()=>{this.listItemInfoPress(item,index)}}
            onPress={async ()=>{await this.call(item.phoneNumber)}}
        />
    };

    closeItemVoicemai = (index)=>{
        if(index !== null && this.voicemailItems[index]){
            this.voicemailItems[index].closeContent()
        }
    };

    itemVoicemailPress = (index)=>{
        this.setState({
            openedVoicemailItem: index
        })
    };

    mutePress = ()=>{
        this.setState({speakerOn: !this.state.speakerOn})
    };

    setLoaderVisibleVoicemail = (val)=>{
        this.setState({
            loaderVisibleVoicemail: val
        })
    };

    deleteVoicemail = ()=>{
        this.closeItemVoicemai(this.state.openedVoicemailItem);
    };

    render() {
        const {loaderVisible, callLoaderVisible, speakerOn, openedVoicemailItem, loaderVisibleVoicemail, activeTab, refreshing, loadingMore, refreshingVoicemail, loadingMoreVoicemail, loaderVisibleDeleteVoicemail} = this.state;
        const {userInfo, makeAction, mediaUi} = this.props;

        return (
            <View style={styles.screen}>
                {loaderVisible || loaderVisibleVoicemail || callLoaderVisible || loaderVisibleDeleteVoicemail?<ScreenLoader tabScreen={!mediaUi?true:false} mediaUi={mediaUi}/>:null}
                {!mediaUi?<TabScreenHeader
                    title={'History'}
                />:null}
                {!mediaUi?<TabBarr
                    active={activeTab}
                    text1={'Recent Calls'}
                    text2={'Voicemail'}
                    tabPress={this.tabPress}
                />:null}
                {activeTab === 1?<FlatList
                    ref={ref => this.scrollRef1 = ref}
                    data={loaderVisible?[]:userInfo.callHistory}
                    renderItem={({item,index})=>{
                        return this.renderItem(item,index)
                    }}

                    onScroll={({nativeEvent}) => {this.loadMore({nativeEvent})}}
                    keyExtractor={(item,index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={()=>{this.refreshList()}}
                            tintColor={Colors.activeBullet}
                        />
                    }
                    ListFooterComponent={loadingMore && !refreshing && <View style={styles.listFooter}>
                        <ActivityIndicator size={'small'} color={Colors.activeBullet}/>
                    </View>}
                    ListEmptyComponent={!loaderVisible?<View style={styles.emptyListContainer}>
                        <Image style={styles.contactsEmptyImgStyle} source={require('../../assets/images/no-calls.png')}/>
                        <Text style={styles.emptyListText}>No recent calls</Text>
                    </View>:null}
                />:<FlatList
                    ref={ref => this.scrollRef2 = ref}
                    data={loaderVisibleVoicemail?[]:userInfo.voicemails}
                    renderItem={({item,index})=>{
                        return <VoicemailItem
                            ref={(listItem)=>{
                                this.voicemailItems[index] = listItem;
                            }}
                            data={item}
                            index={index}
                            call={()=>{this.call(item.phoneNumber)}}
                            itemPress={()=>{this.itemVoicemailPress(index)}}
                            closeItemVoicemai={()=>{this.closeItemVoicemai(openedVoicemailItem)}}
                            speakerOn={speakerOn}
                            mutePress={this.mutePress}
                            makeAction={makeAction}
                            setLoaderVisibleVoicemail={(val)=>{
                                this.setState({
                                    loaderVisibleDeleteVoicemail: val
                                })
                            }}
                            deleteVoicemail={this.deleteVoicemail}
                        />
                    }}
                    onScroll={({nativeEvent}) => {this.loadMoreVoicemail({nativeEvent})}}
                    keyExtractor={(item,index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshingVoicemail}
                            onRefresh={()=>{this.refreshListVoicemail()}}
                            tintColor={Colors.activeBullet}
                        />
                    }
                    ListFooterComponent={loadingMoreVoicemail && !refreshingVoicemail && <View style={styles.listFooter}>
                        <ActivityIndicator size={'small'} color={Colors.activeBullet}/>
                    </View>}
                    ListEmptyComponent={!loaderVisibleVoicemail?<View style={styles.emptyListContainer}>
                        <Image style={styles.voicemailsEmptyImgStyle} source={require('../../assets/images/no-voicemail.png')}/>
                        <Text style={styles.emptyListText}>No voicemails</Text>
                    </View>:null}
                />}
            </View>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(History)
