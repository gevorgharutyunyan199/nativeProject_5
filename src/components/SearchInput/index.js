import React, {Component} from 'react';
import {View, TextInput, Keyboard, TouchableOpacity, Text} from 'react-native';
import styles from './styles';
import {Search,Clear} from '../../assets/icons';
import {iconsColors} from '../../assets/RootStyles';
import {sizes} from '../../assets/sizes';
import {DeviceInfo} from "../../assets/DeviceInfo";

class SearchInput extends Component{
    state = {
        keyboardShow: false
    };

    cancel = ()=>{
        Keyboard.dismiss();
        if(this.props.value){
            this.props.onChange('')
        }
    };

    render() {
        const {placeholder, value, onChange, keyboardType, returnKeyType,onFocus,onBlur} = this.props;
        const {keyboardShow} = this.state;

        return(
            <View style={styles.contentContainer}>
                <View style={[styles.container, keyboardShow && DeviceInfo.ios && styles.containerWidthShowKeyboard]}>
                    <Search width={sizes.size34} height={sizes.size32} color={iconsColors.gray}/>
                    <TextInput
                        onFocus={()=>{
                            this.setState({keyboardShow: true});
                            if(onFocus){
                                onFocus()
                            }
                        }}
                        onBlur={()=>{
                            this.setState({keyboardShow: false});
                            if(onBlur){
                                onBlur()
                            }
                        }}
                        style={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={text => onChange(text)}
                        placeholderTextColor={iconsColors.gray}
                        keyboardType={keyboardType}
                        returnKeyType={returnKeyType?returnKeyType:'search'}
                    />
                    {value?<TouchableOpacity onPress={()=>{onChange('')}}>
                        <Clear width={sizes.size28} height={sizes.size28}/>
                    </TouchableOpacity>:null}
                </View>
                {keyboardShow && DeviceInfo.ios?<TouchableOpacity onPress={this.cancel}>
                    <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>:null}
            </View>
        )
    }
}

export {SearchInput};

