import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, TextInput, Keyboard, ActivityIndicator} from 'react-native';
import styles from './styles';
import {Attach, MessageSend, MessageSendActive} from "../../assets/icons";
import {sizes} from "../../assets/sizes";
import {Colors, iconsColors} from "../../assets/RootStyles";
import AppContext from "../../AppContext";
import ChatService from "../../services/ChatService";
import {useDispatch} from "react-redux";
import {makeAction} from "../../makeAction";
import {REFRESH_CHANNELS_LIST} from "../../actionsTypes";
import ValidationService from "../../services/ValidationService";
import {AttachCustomButton} from "../AttachCustomButton";

const MessageBarr = ({navigation, newChatSelectedItems, showChanel, setInvalidNumArr})=>{
    const [text, setText] = useState('');
    const [attachMenuOpened, setAttachMenuOpened] = useState(false);
    const [loader, setLoader] = useState(false);
    const [keyboardShow, setKeyboardShow] = useState(false);
    const {setChannel} = useContext(AppContext);
    const dispatch = useDispatch();

    const _keyboardDidShow = ()=>{
        setKeyboardShow(true)
    };

    const _keyboardDidHide = ()=>{
        setKeyboardShow(false)
    };

    useEffect(() => {
        let keyboardListenerShow = Keyboard.addListener('keyboardWillShow',_keyboardDidShow);
        let keyboardListenerHide = Keyboard.addListener('keyboardWillHide',_keyboardDidHide);

        let invalidNumArr = [];

        newChatSelectedItems.forEach((i,index)=>{
            let validationNumber = `${i.number}`;
            if(!ValidationService.validate(validationNumber)){
                invalidNumArr.push(index);
            }
        });

        setInvalidNumArr(invalidNumArr);

        return ()=>{
            keyboardListenerShow?.remove();
            keyboardListenerHide?.remove();
        };
    },[JSON.stringify(newChatSelectedItems)]);

    const onChange = (text)=>{
        setText(text)
    };

    const sendPress = async (text)=>{
        setLoader(true);
        await ChatService.creatChannel(newChatSelectedItems, async (data)=>{
            let filters1 = {...ChatService.filters,$or: [{hidden: {$eq: true}},{hidden: {$eq: false}}]};
            const channelsHidden = await ChatService.chatClient.queryChannels(filters1, ChatService.sort, {
                watch: true,
                state: true,
            });
            const channelsAll = await ChatService.chatClient.queryChannels(ChatService.filters, ChatService.sort, {
                watch: true,
                state: true,
            });
            let channels = [...channelsHidden,...channelsAll];
            for (const c of channels) {
                if(c.cid === data.cid){
                    setChannel(c);
                    if(typeof text !== 'string'){
                        await c.sendMessage(text);
                    }else{
                        await c.sendMessage({text: text});
                    }
                    showChanel();
                    dispatch(makeAction(REFRESH_CHANNELS_LIST,{}));
                    break
                }
            }
            setLoader(false);
        }, ()=>{
            setLoader(false);
        })
    };

    return(
        <View>
            <View style={[styles.container,keyboardShow?{marginBottom: 0}:null]}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={()=>{
                        setAttachMenuOpened(!attachMenuOpened)}
                    }
                    disabled={loader || !newChatSelectedItems.length}
                >
                    <Attach width={sizes.size28} height={sizes.size27}/>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={text}
                        onChangeText={text => onChange(text)}
                        placeholderTextColor={iconsColors.gray}
                        placeholder={'Send a message'}
                    />
                </View>
                {loader?<ActivityIndicator size={'small'} color={Colors.messageLoader}/>:!text || !newChatSelectedItems.length?
                    <MessageSend width={sizes.size25} height={sizes.size25} />
                    :<TouchableOpacity onPress={()=>{sendPress(text)}}>
                        <MessageSendActive width={sizes.size26} height={sizes.size26} />
                    </TouchableOpacity>
                }
            </View>
            {attachMenuOpened?<AttachCustomButton
                setAttachMenuOpened={setAttachMenuOpened}
                flashButtonHide={true}
                sendPress={sendPress}
                setLoader={setLoader}
            />:null}
        </View>
    )
};

export {MessageBarr};

