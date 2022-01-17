import React, {Component} from 'react';
import {View, Text, Modal} from "react-native";
import styles from "./styles";
import {Colors} from "../../assets/RootStyles";
import {sizes} from "../../assets/sizes";

class AndroidAlertDialog extends Component{

    state = {
        dialogVisible: false,
        title: '',
        body: '',
        buttons: []
    };

    openDialog = (data)=>{
        this.setState({
            dialogVisible: true,
            title: data.title,
            body: data.body,
            buttons: data.buttons
        })
    };

    closeDialog = ()=>{
        this.setState({
            dialogVisible: false,
        })
    };

    buttonPress = (index)=>{
      this.state.buttons[index].onPress();
        this.closeDialog();
    };

    render() {
        const {title, body, dialogVisible, buttons} = this.state;
        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={dialogVisible}
            >
                <View style={styles.androidMenu}>
                    <View style={styles.contentContainer}>
                        <View style={styles.textContainer}>
                            {title?<Text style={[styles.dialogTitle,!body?{marginBottom: sizes.size41}:null]}>{title}</Text>:null}
                            {body?<Text style={styles.dialogBody}>{body}</Text>:null}
                        </View>
                        <View style={styles.buttonsContainer}>
                            {buttons.map((button, index)=>{
                                return(
                                    <Text key={index.toString()} style={[styles.dialogButton,button.wrong?{color: Colors.wrong}:null]} onPress={()=>{this.buttonPress(index)}}>{button.title}</Text>
                                )
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

export {AndroidAlertDialog}