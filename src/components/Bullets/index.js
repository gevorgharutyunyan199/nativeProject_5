import React from 'react';
import {View} from 'react-native';
import styles from './styles';

const Bullets = ({active})=>{
    return(
        <View style={styles.container}>
            <View style={styles.bulletButton}>
                <View style={[styles.bullet,active === 1?styles.activeBullet:null]}/>
            </View>
            <View style={styles.bulletButton}>
                <View style={[styles.bullet,active === 2?styles.activeBullet:null]}/>
            </View>
            <View style={styles.bulletButton}>
                <View style={[styles.bullet,active === 3?styles.activeBullet:null]}/>
            </View>
            <View style={styles.bulletButton}>
                <View style={[styles.bullet,active === 4?styles.activeBullet:null]}/>
            </View>
            <View style={styles.bulletButton}>
                <View style={[styles.bullet,active === 5?styles.activeBullet:null]}/>
            </View>
            <View style={styles.bulletButton}>
                <View style={[styles.bullet,active === 6?styles.activeBullet:null]}/>
            </View>
        </View>
    )
};

export {Bullets};

