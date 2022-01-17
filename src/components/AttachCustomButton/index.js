import React, {useContext} from 'react';
import {View, TouchableOpacity, Alert, Linking, Keyboard} from 'react-native';
import {ChatCamera, ChatImage, Flash} from "../../assets/icons";
import {sizes} from "../../assets/sizes";
import styles from './styles';
import {check, PERMISSIONS, request} from "react-native-permissions";
import NavigationService from "../../services/NavigationService";
import AppContext from "../../AppContext";
import {makeAction} from '../../makeAction';
import {useDispatch} from "react-redux";
import {ADD_FILE} from '../../actionsTypes';
import { useMessageInputContext } from 'stream-chat-react-native';

const AttachCustomButton = ({setAttachMenuOpened, isExistNotLinexUser, flashButtonHide, sendPress, setLoader})=>{
    const channel = useContext(AppContext).channel;
    const dispatch = useDispatch();
    const { openCommandsPicker } = useMessageInputContext();

    const send = async (file)=>{
        if(setLoader){
            setLoader(true)
        }
        if(file.type === 'image'){
            dispatch(makeAction(ADD_FILE,{
                callback: async (res)=>{
                    const attachments = [
                        {
                            type: 'image',
                            thumb_url: res.uri,
                            asset_url: res.uri,
                            image_url: res.uri,
                        }
                    ];
                    if(sendPress){
                        sendPress({
                            text: '',
                            attachments,
                        })
                    }else {
                        await channel.sendMessage({
                            text: '',
                            attachments,
                        });
                    }
                },
                error: ()=>{},
                file: file,
                type: 'messages'
            }));
        }else if(file.type === 'video'){
            dispatch(makeAction(ADD_FILE,{
                callback: async (res)=>{
                    const attachments = [
                        {
                            mime_type: "video/mp4",
                            title: `${file.name}.mp4`,
                            type: 'file',
                            thumb_url: res.uri,
                            asset_url: res.uri
                        }
                    ];
                    if(sendPress){
                        sendPress({
                            text: '',
                            attachments,
                        })
                    }else {
                        await channel.sendMessage({
                            text: '',
                            attachments,
                        });
                    }
                },
                error: ()=>{},
                file: file,
                type: 'messages'
            }))
        }
    };

    const openGallery = async ()=>{
        setAttachMenuOpened(false);
        Keyboard.dismiss();
        await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        await check(PERMISSIONS.IOS.PHOTO_LIBRARY).then((res)=>{
            if(res === 'blocked'){
                Alert.alert(
                    "Library Unavailable",
                    "LineX does not have access to your \nLibrary. To enable access, go to \nSettings and turn on Library.",
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Settings', onPress: () =>  Linking.openURL('app-settings://')}
                    ]
                );
            }else {
                NavigationService.navigation.navigate('Gallery', {
                    send: send,
                    isExistNotLinexUser
                });
            }
        });
    };

    const takePhoto = async ()=>{
        setAttachMenuOpened(false);
        Keyboard.dismiss();
        await request(PERMISSIONS.IOS.CAMERA);
        await check(PERMISSIONS.IOS.CAMERA).then((res)=>{
            if(res === 'blocked'){
                Alert.alert(
                    "Camera Unavailable",
                    "LineX does not have access to your \ncamera. To enable access, go to \nSettings and turn on Camera.",
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Settings', onPress: () =>  Linking.openURL('app-settings://')}
                    ]
                );
            }else{
                NavigationService.navigation.navigate('CameraPage', {
                    send: send
                });
            }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.imageButton} onPress={openGallery}>
                <ChatImage width={sizes.size40} height={sizes.size40}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto}>
                <ChatCamera width={sizes.size40} height={sizes.size40}/>
            </TouchableOpacity>
            {!flashButtonHide?<TouchableOpacity
                onPress={()=>{
                    setAttachMenuOpened(false);
                    openCommandsPicker()
                }}
                style={{width: sizes.size40, height: sizes.size40, justifyContent: 'center', alignItems: 'center'}}
            >
                <Flash width={sizes.size22} height={sizes.size22}/>
            </TouchableOpacity>:null}
        </View>
    )
};

export {AttachCustomButton};
