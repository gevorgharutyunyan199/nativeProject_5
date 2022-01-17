import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import Iaphub from "react-native-iaphub";
import {ScreenLoader} from "../../components/ScreenLoader";
import styles from "./styles";
import {TabScreenHeader} from "../../components/TabScreenHeader";

class SubscriptionDetails extends Component{
    state = {
        loaderVisible: true,
        products: [],
        purchaseDate: '',
        method: ''
    };

    async componentDidMount() {
        await Iaphub.getActiveProducts().then((products)=>{
            if(products.length){
                let purchaseDate = new Date(products[0].purchaseDate);
                this.setState({
                    loaderVisible: false,
                    products: products,
                    method: products[0].sku.indexOf('android')>-1?'Google Pay':'iTunes',
                    purchaseDate: `${purchaseDate.toLocaleDateString('en-US', {month: 'short'})} ${purchaseDate.getDate()}, ${purchaseDate.getFullYear()}`
                })
            }
        });
    }

    restore = async ()=>{
        this.setState({
            loaderVisible: true
        });

        await Iaphub.restore().then(()=>{
            Alert.alert('Your purchase is restored \nsuccessfully.','');
            this.setState({
                loaderVisible: false
            });
        }).catch((e)=>{
            Alert.alert('No purchase receipt found \non this device.','');
            this.setState({
                loaderVisible: false
            });
            console.log(e)
        });
    };

    render() {
        const {navigation} = this.props;
        const {loaderVisible,purchaseDate,method} = this.state;

        return(
            <View style={styles.screen}>
                {loaderVisible?<ScreenLoader tabScreen={true}/>:null}
                <View style={styles.headerContainer}>
                    <TabScreenHeader
                        title={'Subscription'}
                        leftIcon={'back'}
                        leftIconPress={()=>{
                            navigation.goBack()
                        }}
                    />
                </View>
                <View style={styles.itemBackground}>
                    <View style={styles.settingItemContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Next billing date</Text>
                        </View>
                        <View style={styles.arrowIconContainer}>
                            <Text style={[styles.itemText, styles.valueText]}>{purchaseDate}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.itemBackground}>
                    <View style={styles.settingItemContainer}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Method</Text>
                        </View>
                        <View style={styles.arrowIconContainer}>
                            <Text style={[styles.itemText, styles.valueText]}>{method}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.itemBackground}>
                    <TouchableOpacity style={styles.settingItemContainer} onPress={this.restore}>
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemText}>Restore Purchases</Text>
                        </View>
                        <View style={styles.arrowIconContainer}/>
                    </TouchableOpacity>
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

export default connect(mapStateToProps,{makeAction})(SubscriptionDetails)
