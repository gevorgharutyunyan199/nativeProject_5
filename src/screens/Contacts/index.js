import React, {Component} from 'react';
import {View, KeyboardAvoidingView, FlatList, Text, RefreshControl, Image, TouchableOpacity} from 'react-native';
import {TabScreenHeader, SearchInput, ScreenLoader} from '../../components';
import styles from './styles';
import {DeviceInfo} from "../../assets/DeviceInfo";
import {Colors} from "../../assets/RootStyles";
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {GET_CONTACTS, SET_SCROLL_REF} from "../../actionsTypes";
import ContactsService from "../../services/ContactsService";
import ValidationService from "../../services/ValidationService";

class Contacts extends Component {

    state = {
        loaderVisible: true,
        search: '',
        refreshing: false,
        loadingMore: false,
        loading: false,
        newChat: false
    };

    async componentDidMount() {
        const {route} = this.props;
        if(route.params && route.params.newChat){
            this.setState({
                newChat: true
            })
        }
        this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
            this.props.makeAction(SET_SCROLL_REF,this.scrollRef1);
            this.refreshPage();
        });
    }

    componentWillUnmount() {
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove()
        }
    }

    getContacts = ()=>{
        const {makeAction} =  this.props;
        const {loaderVisible} =  this.state;
        if(!loaderVisible){
            this.setState({
                loaderVisible: true
            });
        }
        makeAction(GET_CONTACTS,{
            callback: async ()=>{
                try {
                    this.setState({
                        loaderVisible: false,
                        refreshing: false
                    });
                    await ContactsService.getPhoneContacts();
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


    handleChange = (key, value)=>{
        this.setState({
            [key]: value,
            loading: true
        })
    };


    addContact = ()=>{
        this.props.navigation.navigate('EditContact', {
            getContacts: this.refreshPage,
            rootScreen: this.state.newChat?'Contacts':'ContactsStack'
        })
    };

    refreshList = ()=>{
        const {refreshing} = this.state;
        if(!refreshing){
            this.setState({
                refreshing: true
            });
                this.props.makeAction(GET_CONTACTS,{
                    callback: async ()=>{
                        try {
                            this.setState({
                                loaderVisible: false,
                                refreshing: false
                            });
                            await ContactsService.getPhoneContacts();
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

    refreshPage = ()=>{
        this.props.makeAction(GET_CONTACTS,{
            callback: async ()=>{
                try {
                    this.setState({
                        loaderVisible: false,
                        refreshing: false
                    });
                    await ContactsService.getPhoneContacts();
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

    checkSearchResult = (listData)=>{
        let arr = [];
        listData.forEach((item)=>{
            let result = false;
            const {search} = this.state;
            if(item.givenName && item.givenName.toLowerCase().indexOf(search.toLowerCase())>-1){
                result = true
            }
            if(item.familyName && item.familyName.toLowerCase().indexOf(search.toLowerCase())>-1){
                result = true
            }
            item.phoneNumbers.forEach((i)=>{
                if(i.number.toLowerCase().indexOf(search.toLowerCase())>-1){
                    result = true
                }
            });
            if(result){
                arr.push(item)
            }
        });
        return arr
    };

    renderItem = (item,index)=>{
        const {navigation} = this.props;
        let disabled = !item.phoneNumbers || (!item.phoneNumbers.length && this.state.newChat);

        return(
            <TouchableOpacity disabled={disabled} style={styles.itemContainer} onPress={()=>{
                if(this.state.newChat){
                    if(item.phoneNumbers.length>1){
                        navigation.navigate('ContactDetails',{
                            index: index,
                            number: item.phoneNumber,
                            id: item.id,
                            phoneContact: true,
                            getContacts: this.refreshPage,
                            rootScreen: this.state.newChat?'Contacts':'ContactsStack',
                            suggestionPress: this.props.route.params && this.props.route.params.suggestionPress?this.props.route.params.suggestionPress:null
                        });
                    }else {
                        if(item.phoneNumbers.length){
                            let data = {
                                givenName: item.givenName,
                                familyName: item.familyName,
                                phoneNumber: item.phoneNumbers[0].number,
                                label: item.phoneNumbers[0].label,
                                id: item.id
                            };
                            this.props.route.params.suggestionPress(data);
                            setTimeout(()=>{
                                this.props.navigation.goBack();
                            },300);
                        }
                    }
                    return
                }
                navigation.navigate('ContactDetails',{
                    index: index,
                    number: item.phoneNumber,
                    id: item.id,
                    getContacts: this.refreshPage,
                    rootScreen: this.state.newChat?'Contacts':'ContactsStack'
                })
            }}>
                <Text style={[styles.itemText,disabled?{color: Colors.grayText}:null]} numberOfLines={1} ellipsizeMode={'tail'}>{item.givenName || item.familyName?`${item.givenName?item.givenName+' ':''}${item.familyName?item.familyName:''}`:`${item.phoneNumbers && item.phoneNumbers[0]?ValidationService.parsePhoneNumber(item.phoneNumbers[0].number):'No name'}`}</Text>
            </TouchableOpacity>
        )
    };

    render() {
        const {loaderVisible,search,refreshing,newChat} = this.state;
        const {navigation,userInfo} = this.props;

        let listData = userInfo.appContacts;

        if(search){
            listData = this.checkSearchResult(listData)
        }

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                {loaderVisible?<ScreenLoader tabScreen={!newChat}/>:null}
                <View style={styles.screen}>
                    {newChat?<TabScreenHeader
                        title={'Contacts'}
                        rightIcon={'cancel'}
                        rightIconPress={navigation.goBack}
                    />:<TabScreenHeader
                        title={'Contacts'}
                        rightIcon={'plus'}
                        rightIconPress={this.addContact}
                    />}

                    {userInfo.syncing?<View style={styles.syncingIndicator}>
                        <Text style={styles.indicatorText}>Syncing… Swipe down to see new contacts</Text>
                    </View>:null}

                    <View style={styles.searchInputContainer}>
                        <SearchInput
                            onChange={(text)=>{
                                this.handleChange('search',text);
                            }}
                            value={search}
                            placeholder={'Search'}
                            returnKeyType={'search'}
                        />
                    </View>
                    <View style={styles.contentContainer}>
                        <FlatList
                            ref={ref => this.scrollRef1 = ref}
                            keyboardShouldPersistTaps="handled"
                            data={listData}
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
                                <Image style={styles.contactsEmptyImgStyle} source={require('../../assets/images/no-contact.png')}/>
                                <Text style={styles.emptyListText}>{search?'No Results':'Contacts list is empty'}</Text>
                            </View>:null}
                        />
                    </View>
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

export default connect(mapStateToProps,{makeAction})(Contacts)
