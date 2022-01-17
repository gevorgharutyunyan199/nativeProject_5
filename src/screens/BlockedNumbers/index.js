import React, {Component} from 'react';
import {FlatList, Image, KeyboardAvoidingView, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import {ScreenLoader, SearchInput, TabScreenHeader} from '../../components';
import styles from './styles';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {Colors} from "../../assets/RootStyles";
import {GET_BLOCKED_CONTACTS, UNBLOCK_NUMBER} from "../../actionsTypes";
import ValidationService from "../../services/ValidationService";

class BlockedNumbers extends Component {

    state = {
        loaderVisible: true,
        search: '',
        refreshing: false,
        keyboardShow: false,
        noSearchResult: false
    };

    componentDidMount() {
        this.getBlockedContacts();
        this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
            this.getBlockedContacts();
        });
    }

    componentWillUnmount() {
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove()
        }
    }

    getBlockedContacts = ()=>{
        const {makeAction} = this.props;
        const {loaderVisible} = this.state;
        if(!loaderVisible){
            this.setState({
                loaderVisible: true
            });
        }
        makeAction(GET_BLOCKED_CONTACTS,{
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
            }
        });
    };

    refreshList = ()=>{
        const {makeAction} =  this.props;
        const {refreshing} = this.state;
        if(!refreshing){
            this.setState({
                refreshing: true
            });
            makeAction(GET_BLOCKED_CONTACTS,{
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
                }
            });
        }
    };

    handleChange = (key, value)=>{
        this.setState({
            [key]: value
        },()=>{
            this.checkSearchResult()
        })
    };

    checkSearchResult = ()=>{
        const {userInfo} = this.props;
        const {search} = this.state;

        let count = 0;

        for(let i = 0; i < userInfo.blockedContacts.length; i++){
            let contact = userInfo.blockedContacts[i];

            if(`${contact.givenName} ${contact.familyName}`.toLowerCase().indexOf(search.toLowerCase())>-1){
                count++;
            }else{
                for(let j = 0; j < contact.phoneNumbers.length; j++){
                    if(`${contact.phoneNumbers[j].number}`.toLowerCase().indexOf(search.toLowerCase())>-1){
                        count++;
                    }
                }
            }
        }

        this.setState({
            noSearchResult: count === 0
        })
    };

    unBlock = (item)=>{
        const {makeAction} = this.props;
        const {loaderVisible} = this.state;

        if(!loaderVisible){
            this.setState({
                loaderVisible: true
            })
        }

        makeAction(UNBLOCK_NUMBER,{
            callback: ()=>{
                makeAction(GET_BLOCKED_CONTACTS,{
                    callback: ()=>{
                        try {
                            this.setState({
                                loaderVisible: false
                            })
                        }catch (e){
                            console.log(e)
                        }
                    },
                    error: ()=>{
                        this.setState({
                            loaderVisible: false
                        })
                    }
                });
            },
            error: ()=>{
                this.setState({
                    loaderVisible: false
                })
            },
            contactId: item.id,
            number: item.callsFrom
        })
    };

    renderItem = (item)=>{
        const {search} = this.state;
        let name  = '';

        if(item.id){
            name = item.givenName || item.familyName?`${item.givenName?item.givenName+' ':''}${item.familyName?item.familyName:''}`:`${item.phoneNumbers && item.phoneNumbers[0]?ValidationService.parsePhoneNumber(item.phoneNumbers[0].number):'No name'}`
        }else {
            name = ValidationService.parsePhoneNumber(item.callsFrom)
        }

        return name.toLowerCase().indexOf(search)>-1?<View style={styles.itemContainer}>
            <Text style={styles.itemText} numberOfLines={1} ellipsizeMode={'tail'}>{name}</Text>
            <TouchableOpacity style={styles.unblockButton} onPress={()=>{this.unBlock(item)}}>
                <Text style={styles.unBlockButtonText}>Unblock</Text>
            </TouchableOpacity>
        </View>:null
    };

    render() {
        const {loaderVisible, search, refreshing, keyboardShow, noSearchResult} = this.state;
        const {navigation, userInfo} = this.props;

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                {loaderVisible?<ScreenLoader/>:null}
                <View style={styles.headerContainer}>
                    <TabScreenHeader
                        title={'Blocked Numbers'}
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                    />
                    <View style={styles.searchInputContainer}>
                        <SearchInput
                            onChange={(text)=>{
                                this.handleChange('search',text);
                            }}
                            value={search}
                            placeholder={'Search'}
                            returnKeyType={'search'}
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
                </View>
                <View style={[styles.contentContainer,DeviceInfo.ios && DeviceInfo.hasNotch && !keyboardShow?styles.contentBottomPadding:null]}>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={noSearchResult?[]:userInfo.blockedContacts}
                        renderItem={({item,index})=>{
                            return this.renderItem(item,index)
                        }}
                        keyExtractor={(item,index) => index.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={()=>{this.refreshList()}}
                                tintColor={Colors.activeBullet}
                            />
                        }
                        ListEmptyComponent={!loaderVisible?<View style={styles.emptyListContainer}>
                            <Image style={styles.contactsEmptyImgStyle} source={require('../../assets/images/no-blocked.png')}/>
                            <Text style={styles.emptyListText}>{search?'No Results':'You haven\'t blocked anyone'}</Text>
                        </View>:null}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(BlockedNumbers)
