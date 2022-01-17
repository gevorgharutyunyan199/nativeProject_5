import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import ChannelUI from '../../components/ChannelUI';
import styles from "../Chat/styles";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {TabScreenHeader, ScreenLoader, Preview} from '../../components';
import ContactsService from "../../services/ContactsService";
import AppContext from "../../AppContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationService from "../../services/ValidationService";
import Modal from 'react-native-modalbox';

const ChannelScreen = (props)=>{
    const [modalVisible, setModalVisible] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const {navigation, activeChannel, showChanel, route} = props;
    const [screenName, setScreenName] = useState({});
    const [loading, setLoading] = useState(false);
    const [callLoading, setCallLoading] = useState(false);
    let channel = activeChannel?activeChannel:useContext(AppContext).channel;
    channel = ( route?.params && route?.params?.channel ) || channel ;
    useEffect(() => {
        if(!loading){
            AsyncStorage.getItem('currentUser').then((user)=>{
                user = JSON.parse(user);
                let contacts = [];
                let chatName = '';
                channel.data.phoneNumbers.forEach((item)=>{
                    if(item !== user.orderedNumbers[0]){
                        let contact = ContactsService.getContactByNumber(item);
                        if(contact){
                            contact.chatName = item;
                            contacts.push(contact)
                        }else {
                            contacts.push({
                                chatName: ValidationService.parsePhoneNumber(item)
                            })
                        }
                    }
                });

                contacts.forEach((contact)=>{
                    let name = '';
                    if(contact){
                        name = contact.givenName || contact.familyName?`${contact.givenName?contact.givenName+' ':''}${contact.familyName?contact.familyName:''}`:`${contact.chatName}`;
                    }else {
                        name = contact.chatName
                    }
                    chatName = chatName?`${chatName}, ${name}`:`${name}`
                });
                setScreenName({
                    name: chatName,
                    label: contacts.length>1?`${contacts.length} people`:contacts[0].id?ContactsService.getNumberLabel(contacts[0].chatName):'Phone'
                });
            });
            setLoading(true)
        }
    }, []);
    const renderContent = ()=>{
        return(
          <View style={styles.screen}>
              {callLoading?<ScreenLoader/>:null}
              {!showChanel?
                  <View style={styles.headerContainer}>
                      <TabScreenHeader
                          leftIcon={'back'}
                          leftIconPress={()=>{
                              navigation.goBack()
                          }}
                          title={screenName}
                          type={'chat'}
                          rightIcon={'arrowRight'}
                          rightIconPress={()=>{
                              props.navigation.push('ChatInfo', {numbers: channel.data.phoneNumbers})
                          }}
                          chatNamePress={()=>{
                              props.navigation.push('ChatInfo', {numbers: channel.data.phoneNumbers})
                          }}
                      />
                  </View>:null}
              <View style={styles.contentContainer}>
                  <ChannelUI
                      appContextNoChange={props.appContextNoChange}
                      activeChannel={activeChannel}
                      showChanel={showChanel}
                      setCallLoading={setCallLoading}
                      channel={channel}
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                      videoFile={videoFile}
                      setVideoFile={setVideoFile}
                  />
              </View>
              <Modal
                  isOpen={modalVisible}
              >
                  <Preview
                      file={videoFile}
                      hideModal={()=>{
                          setModalVisible(false)
                      }}
                      onlyShow={true}
                  />
              </Modal>
          </View>
      )
    };

    return(
        !showChanel?<KeyboardAvoidingView
            style={styles.screen}
            behavior={DeviceInfo.ios ? "padding" : "height"}
        >
            {renderContent()}
        </KeyboardAvoidingView>:<View
            style={styles.screen}
        >
            {renderContent()}
        </View>
    )
};

export default ChannelScreen;
