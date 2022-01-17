import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

const Divider = ({text}) => {
    return (
        <View style={styles.container}>
            <View style={styles.dividerItem}/>
            <View>
                <Text style={styles.text}>{text}</Text>
            </View>
            <View style={styles.dividerItem}/>
        </View>
    )
};

export {Divider};

