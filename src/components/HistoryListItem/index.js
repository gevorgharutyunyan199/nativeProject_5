import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {Info, CallIncome, CallOutcome, CallMissed} from '../../assets/icons';
import {sizes} from "../../assets/sizes";
import moment from 'moment';
import ValidationService from "../../services/ValidationService";

const HistoryListItem = ({item,onPress,infoPress})=>{

    let convertDate = (date)=>{
        const formatDate = 'YYYY-MM-DD';
        const getDay = (date) => {
            if (date)
                return moment(date).format(formatDate);
            else
                return moment().format(formatDate)
        };
        const today = moment(getDay(), formatDate).startOf('day');
        const oldDate = moment(getDay(date), formatDate);
        if (today.diff(oldDate, 'day') < 1) {
            return moment(date).format('hh:mm a').toUpperCase();
        } else if (today.diff(oldDate, 'day') < 2) {
            return 'Yesterday'
        } else if (today.diff(oldDate, 'day') < 3) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 4) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 5) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 6) {
            return oldDate.format('dddd');
        } else if (today.diff(oldDate, 'day') < 7) {
            return oldDate.format('dddd');
        } else {
            return oldDate.format('MM.DD.YY');
        }
    };

    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {item.status === 'Missed'?<CallMissed width={sizes.size32} height={sizes.size32} />:null}
            {item.status === 'Received'?<CallIncome width={sizes.size32} height={sizes.size32} />:null}
            {item.status === 'Placed'?<CallOutcome width={sizes.size32} height={sizes.size32} />:null}
            <View style={styles.centerContainer}>
                <Text style={styles.itemName} numberOfLines={1} ellipsizeMode={'tail'}>{item.contact && (item.contact.givenName || item.contact.familyName)?`${item.contact.givenName?item.contact.givenName+' ':''}${item.contact.familyName?item.contact.familyName:''}`:`${ValidationService.parsePhoneNumber(item.phoneNumber)}`}</Text>
                <Text style={styles.number} numberOfLines={1} ellipsizeMode={'tail'}>{ValidationService.parsePhoneNumber(item.phoneNumber)}</Text>
            </View>
            <Text style={styles.time} numberOfLines={1} ellipsizeMode={'tail'}>{convertDate(new Date(item.time))}</Text>
            <TouchableOpacity onPress={infoPress}>
                <Info width={sizes.size32} height={sizes.size32} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
};

export {HistoryListItem};

