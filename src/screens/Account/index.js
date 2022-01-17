import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from "./styles";
import {TabScreenHeader} from "../../components/TabScreenHeader";
import {ArrowRight} from "../../assets/icons";
import {sizes} from "../../assets/sizes";
import {iconsColors} from "../../assets/RootStyles";

class Account extends Component{

    render() {
        const {navigation} = this.props;

        return(
            <View style={styles.screen}>
                <View style={styles.headerContainer}>
                    <TabScreenHeader
                        title={'Account'}
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                    />
                </View>
                <View style={styles.itemBackground}>
                    <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{navigation.navigate('ChangePassword')}}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Change Password</Text>
                        </View>
                        <View style={styles.arrowIconContainer}>
                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.itemBackground}>
                    <TouchableOpacity style={styles.settingItemContainer} onPress={()=>{navigation.navigate('ChangeRegisteredNumber')}}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Change registered number</Text>
                        </View>
                        <View style={styles.arrowIconContainer}>
                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default Account
