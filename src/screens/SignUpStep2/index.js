import React, {Component} from 'react';
import {View, FlatList, RefreshControl, ActivityIndicator, Text, KeyboardAvoidingView} from 'react-native';
import styles from './styles';
import {Colors} from '../../assets/RootStyles';
import {ScreenHeader,SearchInput,SignUpListItem,ScreenLoader} from '../../components';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {makeAction} from '../../makeAction';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    GET_PHONE_NUMBERS_LIST_DATA,
    SET_PENDING_TYPE
} from '../../actionsTypes';

class SignUpStep2 extends Component{

    state = {
        loadingMore: false,
        page: 1,
        search: '',
        loaderVisible: true,
        refreshing: false,
        scrollEnabled: true,
        loading: false,
        keyboardShow: false
    };

    componentDidMount() {
        const {makeAction} =  this.props;
        const {page,search} =  this.state;
        makeAction(GET_PHONE_NUMBERS_LIST_DATA,{
            searchText: search,
            page: page,
            callback: ()=>{
                this.setLoaderVisible(false)
            }
        });
    }

    setInitialState = ()=>{
        this.setState({
            loadingMore: false,
            page: 1,
            scrollEnabled: true
        })
    };

    refreshList = ()=>{
        const {makeAction} =  this.props;
        if(!this.state.refreshing){
            this.setInitialState();
            this.setState({
                refreshing: true
            });
            makeAction(GET_PHONE_NUMBERS_LIST_DATA,{
                searchText: this.state.search,
                page: 1,
                callback: ()=>{
                    this.setState({refreshing: false})
                }
            });
        }
    };

    handleChange = (key, value)=>{
        this.setState({
            [key]: value,
            loading: true
        },()=>{
            if(this.timeout){
                clearTimeout(this.timeout)
            }
            this.timeout = setTimeout(()=>{
                this.setInitialState();
                this.props.makeAction(GET_PHONE_NUMBERS_LIST_DATA,{
                    page: 1,
                    callback: ()=>{
                        this.setState({
                            loading: false
                        })
                    },
                    searchText: value
                });
            },500)
        })
    };

    setLoaderVisible = (value)=>{
        this.setState({
            loaderVisible: value
        })
    };

    selectItem = async (item)=>{
        const {navigation} =  this.props;
        await AsyncStorage.setItem('selectedPhoneNumber',`${item}`);
        let currentUser = await AsyncStorage.getItem('currentUser');
        if(currentUser){
            this.props.makeAction(SET_PENDING_TYPE,0);
            navigation.navigate('SettingUpPhoneNumber');
        }else {
            navigation.navigate('CreateAccount');
        }
    };

    renderItem = (item)=>{
        return <SignUpListItem title={`(${item.substring(0,3)}) ${item.substring(3,6)}-${item.substring(6,item.length)}`} onPress={()=>{this.selectItem(item)}}/>
    };

    loadMore = (e)=>{
        const {page,loadingMore,scrollEnabled} = this.state;
        const {makeAction,signUpData} = this.props;
        if(e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height-0.1){
            if(!loadingMore && scrollEnabled && signUpData.phoneNumbers.length>39){
                this.setState({
                    loadingMore: true,
                    page: page+1,
                },()=>{
                    setTimeout(()=>{
                        makeAction(GET_PHONE_NUMBERS_LIST_DATA,
                            {
                                searchText: this.state.search,
                                page: this.state.page,
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
                                }
                            }
                        )
                    },500);
                })
            }
        }
    };

    render() {
        const {navigation,signUpData} = this.props;
        const {search,loaderVisible,refreshing,loadingMore,loading,keyboardShow} = this.state;

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                {loaderVisible?<ScreenLoader/>:null}
                <ScreenHeader
                    title={'Choose your LineX Number'}
                    leftIcon={'Back'}
                    leftIconPress={()=>{navigation.goBack()}}
                />
                <View style={styles.inputContainer}>
                    <SearchInput
                        onChange={(text)=>{this.handleChange('search',text)}}
                        value={search}
                        placeholder={'Search'}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                        onFocus={()=>{
                            this.setState({
                                keyboardShow: true
                            })
                        }}
                        onBlur={()=>{
                            this.setState({
                                keyboardShow: false
                            })
                        }}
                    />
                </View>
                {DeviceInfo.ios && DeviceInfo.hasNotch && !keyboardShow?<View style={styles.scrollContainer}>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={signUpData.phoneNumbers}
                        renderItem={({item})=>{
                            return this.renderItem(item)
                        }}
                        keyExtractor={(item,index) => index.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={()=>{this.refreshList()}}
                                tintColor={Colors.activeBullet}
                                size={12}
                            />
                        }
                        ListFooterComponent={loadingMore && !refreshing && <View style={styles.listFooter}>
                            <ActivityIndicator size={'small'} color={Colors.activeBullet}/>
                        </View>}
                        onScroll={({nativeEvent}) => {this.loadMore({nativeEvent})}}
                        ListEmptyComponent={!loaderVisible && !loading && !signUpData.phoneNumbers.length?<View style={styles.emptyListContainer}>
                            <Text style={styles.emptyListText}>{search?'No Results':'No numbers available'}</Text>
                        </View>:null}
                    />
                </View>:<FlatList
                    keyboardShouldPersistTaps="handled"
                    data={signUpData.phoneNumbers}
                    renderItem={({item})=>{
                        return this.renderItem(item)
                    }}
                    keyExtractor={(item,index) => index.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={()=>{this.refreshList()}}
                            tintColor={Colors.activeBullet}
                            size={12}
                        />
                    }
                    ListFooterComponent={loadingMore && !refreshing && <View style={styles.listFooter}>
                        <ActivityIndicator size={'small'} color={Colors.activeBullet}/>
                    </View>}
                    onScroll={({nativeEvent}) => {this.loadMore({nativeEvent})}}
                    ListEmptyComponent={!loaderVisible && !loading && !signUpData.phoneNumbers.length?<View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>{search?'No Results':'No numbers available'}</Text>
                    </View>:null}
                />}
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = store =>{
    return {
        signUpData: store.SignUpReducer
    }
};

export default connect(mapStateToProps,{makeAction})(SignUpStep2)
