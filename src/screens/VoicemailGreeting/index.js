import React, {Component} from 'react';
import {View, TouchableOpacity, FlatList, Text, RefreshControl, Alert} from 'react-native';
import styles from './styles';
import {TabScreenHeader, ScreenLoader} from '../../components';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {Check, Info} from '../../assets/icons';
import {sizes} from "../../assets/sizes";
import {Colors} from "../../assets/RootStyles";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {
    GET_VOICEMAIL_GREETINGS,
    ENABLE_VOICEMAIL_GREETING
} from "../../actionsTypes";

class VoicemailGreeting extends Component{

    state = {
        loaderVisible: true,
        refreshing: false
    };

    componentDidMount() {
        this.getData()
    }

    getData = ()=>{
        this.props.makeAction(GET_VOICEMAIL_GREETINGS,{
            callback: ()=>{
                this.setState({
                    loaderVisible: false
                })
            },
            error: ()=>{
                this.setState({
                    loaderVisible: false
                })
            }
        })
    };

    refreshList = ()=>{
        this.setState({
            refreshing: true
        });

        this.props.makeAction(GET_VOICEMAIL_GREETINGS,{
            callback: ()=>{
                this.setState({
                    refreshing: false
                })
            },
            error: ()=>{
                this.setState({
                    refreshing: false
                })
            }
        })
    };

    itemPress = (item)=>{
        this.setState({
            loaderVisible: true
        });

        this.props.makeAction(ENABLE_VOICEMAIL_GREETING,{
            callback: ()=>{
                this.props.makeAction(GET_VOICEMAIL_GREETINGS,{
                    callback: ()=>{
                        this.setState({
                            loaderVisible: false
                        })
                    },
                    error: ()=>{
                        this.setState({
                            loaderVisible: false
                        })
                    }
                })
            },
            error: ()=>{
                this.setState({
                    loaderVisible: false
                })
            },
            name: item.name
        })
    };

    itemInfoPress = (item)=>{
        this.props.navigation.navigate('EditGreeting', {getData: this.getData, item: item})
    };

    render() {
        const {loaderVisible, refreshing} = this.state;
        const {navigation, userInfo} = this.props;

        return(
            <View style={styles.screen}>
                {loaderVisible?<ScreenLoader/>:null}
                <View style={styles.headerContainer}>
                    <TabScreenHeader
                        title={'Voicemail Greeting'}
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <FlatList
                        data={userInfo.voicemailGreeting}
                        renderItem={({item, index})=><View style={styles.itemContainer}>
                            <TouchableOpacity style={styles.itemContentContainer} onPress={()=>{this.itemPress(item,index)}}>
                                <View style={styles.itemIconContainer}>
                                    {item.isEnabled?<View style={styles.iconButton}>
                                        <Check width={sizes.size32} height={sizes.size32}/>
                                    </View>:null}
                                </View>
                                <View style={styles.itemNameContainer}>
                                    <Text style={styles.itemName} numberOfLines={1} ellipsizeMode={'tail'}>{item.name}</Text>
                                </View>
                                <View style={styles.itemIconContainer}>
                                    {item.name !== 'Default Greeting'?<TouchableOpacity style={styles.iconButton} onPress={()=>{this.itemInfoPress(item)}}>
                                        <Info width={sizes.size32} height={sizes.size32} />
                                    </TouchableOpacity>:null}
                                </View>
                            </TouchableOpacity>
                        </View>}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={<TouchableOpacity style={[styles.createGreetingButton]} onPress={()=>{
                            if(userInfo.voicemailGreeting.length>=10){
                                Alert.alert('You reached the limit of 10 voicemails.','Please remove existing voicemails to create new ones.');
                                return
                            }
                            navigation.navigate('EditGreeting', {newGreeting: true, getData: this.getData})
                        }}>
                            <Text style={[styles.createGreetingButtonText,DeviceInfo.android?styles.createGreetingButtonTextAndroid:null]}>{DeviceInfo.ios?'Create Greeting':'CREATE GREETING'}</Text>
                        </TouchableOpacity>}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={()=>{this.refreshList()}}
                                tintColor={Colors.activeBullet}
                            />
                        }
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = store =>{
    return {
        userInfo: store.UserInfoReducer
    }
};

export default connect(mapStateToProps,{makeAction})(VoicemailGreeting)
