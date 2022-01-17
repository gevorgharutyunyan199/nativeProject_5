import React, {Component} from 'react';
import {
    KeyboardAvoidingView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import {ChatAdd} from '../../assets/icons';
import styles from './styles';
import {TabScreenHeader, ScreenLoader, MessageBarr} from '../../components';
import {DeviceInfo} from '../../assets/DeviceInfo';
import {makeAction} from '../../makeAction';
import {connect} from 'react-redux';
import {sizes} from "../../assets/sizes";
import NavigationService from "../../services/NavigationService";
import ChannelScreen from '../../screens/ChannelScreen';
import ChatService from "../../services/ChatService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from "../../assets/RootStyles";
import {
    GET_SUGGESTIONS_CONTACTS
} from "../../actionsTypes";
import ValidationService from "../../services/ValidationService";

class Chat extends Component{
    state = {
        toInputValue: '',
        newChatSelectedItems: [],
        suggestions: [],
        loaderVisible: false,
        chanelVisible: false,
        activeChannel: null,
        toInputFocused: true,
        invalidNumArr: []

    };

    componentDidMount() {
        this.navigationListenerFocus = this.props.navigation.addListener('focus', async () => {
            NavigationService.init(this.props.navigation,this.props.route);
        });

        const {route} = this.props;

        if(route.params && route.params.chatData){
            this.suggestionPress(route.params.chatData);
        }

        if(this.toInput){
            this.toInput.focus();
        }
    }

    componentWillUnmount() {
        if(this.navigationListenerFocus && this.navigationListenerFocus.remove){
            this.navigationListenerFocus.remove();
            NavigationService.init(this.props.navigation);
        }
    };

    addPress = ()=>{
        const {navigation} = this.props;
        navigation.navigate('Contacts', {newChat: true, suggestionPress: this.suggestionPress, toInput: this.toInput})
    };

    checkChatIdByNumber = async ()=>{
        this.setState({
            activeChannel: null
        });
        AsyncStorage.getItem('currentUser').then(async (user)=>{
            user = JSON.parse(user);
            let numbers = [user.orderedNumbers[0]];
            this.state.newChatSelectedItems.forEach((i)=>{
                numbers.push(ValidationService.formatePhoneNumber(i.number))
            });

            const filter = {members: { $in: [user.id] }, phoneNumbers: { $in: numbers} };

            const sort = [{ last_message_at: -1 }];

            const channels = await ChatService.chatClient.queryChannels(filter, sort, {
                watch: true,
                state: true,
            });
            if(channels.length){
                channels.forEach(c=>{
                    if(c.data.phoneNumbers.length === numbers.length){
                        this.setState({
                            activeChannel: c
                        })
                    }
                });
            }
        });
    };

    checkSuggestions = ()=>{
        if(this.state.toInputValue){
            this.props.makeAction(GET_SUGGESTIONS_CONTACTS,{
                callback: (data)=>{
                    let suggestions = [...data];
                    this.setState({
                        suggestions: suggestions
                    })
                },
                error: ()=>{},
                searchText: this.state.toInputValue
            });
        }else {
            this.setState({
                suggestions: []
            })
        }
    };

    suggestionPress = (item)=>{
        this.setState({
            toInputValue: ''
        },()=>{
            if(this.toInput){
                this.toInput.blur();
                this.intervalCheck = setInterval(()=>{
                    if(this.toInput){
                        this.toInput.focus();
                        clearInterval(this.intervalCheck)
                    }
                },100)
            }
        });

        let newItem = {
            number: item.phoneNumbers && item.phoneNumbers.length?item.phoneNumbers[0].number:item.phoneNumber,
            name: item.givenName || item.familyName?`${item.givenName?item.givenName+' ':''}${item.familyName?item.familyName:''}`:`${item.phoneNumbers && item.phoneNumbers.length?item.phoneNumbers[0].number:item.phoneNumber}`,
            id: item.id
        };

        this.setState({
            newChatSelectedItems: [...this.state.newChatSelectedItems,newItem],
            suggestions: []
        },()=>{
            this.checkChatIdByNumber()
        })
    };

    showChanel = ()=>{
        this.setState({
            chanelVisible: true
        })
    };

    render() {
        const {
            newChatSelectedItems,
            toInputFocused,
            toInputValue,
            suggestions,
            loaderVisible,
            chanelVisible,
            activeChannel,
            invalidNumArr
        } = this.state;
        const {navigation, route} = this.props;
        let newChat = route.params && route.params.newChat;

        return (
            chanelVisible?<ChannelScreen
                navigation={navigation}
                activeChannel={activeChannel}
            />:activeChannel && !newChat?<ChannelScreen
                appContextNoChange={route.params?.appContextNoChange}
                activeChannel={activeChannel}
                showChanel={route.params.newChat?this.showChanel:null}
                navigation={navigation}
            />:<KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                {loaderVisible?<ScreenLoader/>:null}
                {newChat?<View style={styles.headerContainer}>
                    <TabScreenHeader
                        title={'New Message'}
                        rightIcon={'cancel'}
                        rightIconPress={navigation.goBack}
                    />
                </View>:null}
                {route.params.chatData && !activeChannel?<View style={styles.headerContainer}>
                    <TabScreenHeader
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                        title={{
                            name: route.params.chatData.givenName || route.params.chatData.familyName?`${route.params.chatData.givenName?route.params.chatData.givenName+' ':''}${route.params.chatData.familyName?route.params.chatData.familyName:''}`:route.params.phoneNumber,
                            label: route.params.label
                        }}
                        type={'chat'}
                    />
                </View>:null}
                {newChat?<TouchableWithoutFeedback onPress={()=>{
                    if(this.toInput){
                        this.toInput.focus()
                    }
                }}><View style={styles.toSectionContainer}>
                    <Text style={styles.toText}>To:</Text>
                    <View style={styles.itemsGroupAndToInputContainer}>
                        {newChatSelectedItems.map((item,index)=>{
                            return <TextInput
                                key={index.toString()}
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                selectTextOnFocus={true}
                                style={[styles.chatSelectedItem,invalidNumArr.indexOf(index)>-1?{color: Colors.wrong}:null]}
                                value={item.name.replace(/\r?\n/g, "")}
                                onKeyPress={(e) => {
                                    const {key} = e.nativeEvent;
                                    if(key === 'Backspace'){
                                        if(this.toInput){
                                            this.toInput.focus();
                                        }
                                        newChatSelectedItems.splice(index, 1);
                                        this.setState({
                                            newChatSelectedItems: newChatSelectedItems
                                        },()=>{
                                            if(this.state.newChatSelectedItems.length){
                                                this.checkChatIdByNumber();
                                            }else {
                                                this.setState({
                                                    activeChannel: null
                                                });
                                            }
                                        })
                                    }
                                }}
                            />
                        })}
                        <TextInput
                            ref={(input)=>{this.toInput = input}}
                            style={[styles.toInput,!toInputFocused && newChatSelectedItems.length?{height: 0}:null]}
                            value={toInputValue}
                            onSubmitEditing={()=> {
                                if(this.state.toInputValue){
                                    this.intervalCheck = setInterval(()=>{
                                        if(this.toInput){
                                            clearInterval(this.intervalCheck);
                                            this.toInput.focus();
                                        }
                                    },100)
                                }
                            }}
                            onKeyPress={(e) => {
                                const {key} = e.nativeEvent;
                                if(key === 'Backspace' && !this.state.toInputValue){
                                    let arr = newChatSelectedItems.slice(0, -1);
                                    this.setState({
                                        newChatSelectedItems: arr
                                    },()=>{
                                        if(this.state.newChatSelectedItems.length){
                                            this.checkChatIdByNumber();
                                        }else {
                                            this.setState({
                                                activeChannel: null
                                            });
                                        }
                                    })
                                }
                            }}
                            onChangeText={(textValue)=>{
                                this.setState({
                                    toInputFocused: true,
                                    toInputValue: textValue
                                },()=>{
                                    if(textValue){
                                        if(this.timeout){
                                            clearTimeout(this.timeout)
                                        }
                                        this.timeout = setTimeout(()=>{
                                            this.checkSuggestions();
                                        },500);
                                    }
                                });
                            }}
                            onBlur={()=>{
                                let text = toInputValue;
                                if(text){
                                    let newItem = {
                                        number: text,
                                        name: text
                                    };

                                    this.setState({
                                        toInputFocused: false,
                                        newChatSelectedItems: [...this.state.newChatSelectedItems,newItem]
                                    },()=>{
                                        this.checkChatIdByNumber()
                                    })
                                }
                                this.setState({
                                    suggestions: [],
                                    toInputFocused: false,
                                    toInputValue: ''
                                });
                            }}
                            onFocus={()=>{
                                this.setState({
                                    toInputFocused: true
                                });
                            }}
                        />
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={this.addPress}>
                        <ChatAdd width={sizes.size32} height={sizes.size32} />
                    </TouchableOpacity>
                </View></TouchableWithoutFeedback>:null}
                {suggestions.length && toInputFocused?<FlatList
                    keyboardShouldPersistTaps="handled"
                    data={suggestions}
                    renderItem={({item})=>item.phoneNumbers[0]?<TouchableOpacity style={styles.suggestionsListItemContainer} onPress={()=>{this.suggestionPress(item)}}>
                        <Text style={styles.suggestionsItemTitle} numberOfLines={1} ellipsizeMode={'tail'}>{item.givenName || item.familyName?`${item.givenName?item.givenName+' ':''}${item.familyName?item.familyName:''}`:`${item.phoneNumbers && item.phoneNumbers[0]?item.phoneNumbers[0].number:'No name'}`}</Text>
                        {item.phoneNumbers && item.phoneNumbers[0]?<Text style={styles.suggestionsItemNumber}>{item.phoneNumbers[0].label?item.phoneNumbers[0].label:'Phone'}: {ValidationService.parsePhoneNumber(item.phoneNumbers[0].number)}</Text>:null}
                    </TouchableOpacity>:null}
                    keyExtractor={(item, index) => index.toString()}
                />:null}
                <View style={styles.screen}>
                    {activeChannel?<ChannelScreen
                        appContextNoChange={route.params?.appContextNoChange}
                        activeChannel={activeChannel}
                        showChanel={route.params.newChat?this.showChanel:null}
                        navigation={navigation}
                    />:null}
                </View>
                {!activeChannel?<MessageBarr
                    navigation={this.props.navigation}
                    newChatSelectedItems={this.state.newChatSelectedItems}
                    showChanel={this.showChanel}
                    setInvalidNumArr={(arr)=>{
                        this.setState({
                            invalidNumArr: arr
                        })
                    }}
                />:null}
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = store =>{
    return {
        chatData: store.ChatReducer
    }
};

export default connect(mapStateToProps,{makeAction})(Chat)
