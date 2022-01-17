import React from 'react';
import {View,TouchableOpacity,Text} from 'react-native';
import styles from './styles';
import {Back, Plus, Chat, ArrowLeft, ChatMenu, Cancel, ArrowRight} from '../../assets/icons';
import {sizes} from '../../assets/sizes';
import {Colors, iconsColors} from '../../assets/RootStyles';
import {DeviceInfo} from "../../assets/DeviceInfo";

const TabScreenHeader = ({longText,title,leftIcon,rightIcon,rightIconPress,leftIconPress,leftIconColor,rightIconColor,leftDisabled,rightDisabled,type,chatNamePress})=>{
    return(
        <View style={[styles.headerContainer]}>
            <View style={[styles.buttonContainerLeft,DeviceInfo.android && leftIcon==='albums'?{width: sizes.size90}:null,DeviceInfo.android && !leftIcon?styles.buttonContainerLeftAndroid:null,DeviceInfo.android && (leftIcon === 'back' || leftIcon === 'cancelIcon')?{width: sizes.size56}:null]}>
                {leftIcon==='back'?<TouchableOpacity onPress={leftIconPress} disabled={leftDisabled}>
                    <Back width={sizes.size32} height={sizes.size32} color={leftIconColor?leftIconColor:iconsColors.gray} />
                </TouchableOpacity>:null}
                {leftIcon==='cancel'?<TouchableOpacity onPress={leftIconPress} disabled={leftDisabled}>
                    <Text style={[styles.linkButtonText,styles.marginLeft7,leftIconColor?{color: leftIconColor}:null]}>Cancel</Text>
                </TouchableOpacity>:null}
                {leftIcon==='cancelIcon'?<TouchableOpacity onPress={leftIconPress} disabled={leftDisabled}>
                    <Cancel width={sizes.size32} height={sizes.size32} color={leftIconColor?leftIconColor:iconsColors.gray} />
                </TouchableOpacity>:null}
                {leftIcon==='albums'?<TouchableOpacity onPress={leftIconPress} disabled={leftDisabled} style={[styles.row,styles.marginLeft7]}>
                    <ArrowLeft width={sizes.size16} height={sizes.size32} />
                    <Text style={[styles.linkButtonText,leftIconColor?{color: leftIconColor}:null]}>Albums</Text>
                </TouchableOpacity>:null}
            </View>
            {type === 'chat'?<View style={[styles.titleContainer]}>
                <TouchableOpacity onPress={chatNamePress?chatNamePress:()=>{}}>
                    {title?<Text style={styles.titleText} numberOfLines={1} ellipsizeMode={'tail'}>{title.name}</Text>:null}
                    {title?<Text style={styles.labelText} numberOfLines={1} ellipsizeMode={'tail'}>{title.label}</Text>:null}
                </TouchableOpacity>
            </View>:<View style={[styles.titleContainer,leftIcon === 'albums'?{alignItems: 'center'}:null]}>
                {title?<Text style={styles.titleText}>{title}</Text>:null}
            </View>}
            <View style={[styles.buttonContainerRight,longText?{width: DeviceInfo.android?sizes.size70:sizes.size60}:null]}>
                {rightIcon==='plus'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <Plus width={sizes.size32} height={sizes.size32} color={rightIconColor?rightIconColor:iconsColors.gray} />
                </TouchableOpacity>:null}
                {rightIcon==='edit'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <Text style={[styles.linkButtonText,styles.marginRight7,rightIconColor?{color: rightIconColor}:null]}>Edit</Text>
                </TouchableOpacity>:null}
                {rightIcon==='save'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <Text style={[DeviceInfo.ios?styles.linkButtonText:styles.linkButtonTextAndroid,styles.marginRight7,rightIconColor?{color: rightIconColor}:null]}>{DeviceInfo.ios?'Save':'SAVE'}</Text>
                </TouchableOpacity>:null}
                {rightIcon==='done'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <Text style={[DeviceInfo.ios?styles.linkButtonText:styles.linkButtonTextAndroid,styles.marginRight7,rightIconColor?{color: rightIconColor}:null]}>{DeviceInfo.ios?'Done':'DONE'}</Text>
                </TouchableOpacity>:null}
                {rightIcon==='chat'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <Chat width={sizes.size32} height={sizes.size32} color={rightIconColor?rightIconColor:iconsColors.gray} />
                </TouchableOpacity>:null}
                {rightIcon==='cancel'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <Text style={[DeviceInfo.ios?styles.linkButtonText:styles.linkButtonTextAndroid,styles.marginRight7,rightIconColor?{color: rightIconColor}:null]}>{DeviceInfo.ios?'Cancel':'CANCEL'}</Text>
                </TouchableOpacity>:null}
                {rightIcon==='menu'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <ChatMenu width={sizes.size32} height={sizes.size32} color={rightIconColor?rightIconColor:iconsColors.gray} />
                </TouchableOpacity>:null}
                {rightIcon==='arrowRight'?<TouchableOpacity onPress={rightIconPress} disabled={rightDisabled}>
                    <ArrowRight width={sizes.size40} height={sizes.size40} color={Colors.appColor1}/>
                </TouchableOpacity>:null}
            </View>
        </View>
    )
};

export {TabScreenHeader}
