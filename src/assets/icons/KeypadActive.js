import React from 'react';
import Svg, {Defs, G, Path, TSpan, Stop, LinearGradient, Text} from 'react-native-svg';

const KeypadActive = ({width,height})=>{
    return(
        <Svg width={width?width:75} height={height?height:49} viewBox="0 0 75 49">
            <Defs>
                <LinearGradient id="9xyu7g230a" x1="-76.001%" x2="134.986%" y1="105.687%" y2="0%">
                    <Stop offset="0%" stopColor="#6c92fb"/>
                    <Stop offset="100%" stopColor="#6c92fb"/>
                </LinearGradient>
            </Defs>
            <G fill="none" fillRule="evenodd">
                <G>
                    <Text fill="#3F4244" fontFamily="SFProText-Regular, SF Pro Text" fontSize="10">
                        <TSpan x="19.758" y="45.5">Keypad</TSpan>
                    </Text>
                    <Path fill="url(#9xyu7g230a)" d="M28.572 7.5c1.696 0 3.07 1.375 3.07 3.07 0 1.698-1.374 3.073-3.07 3.073-1.697 0-3.072-1.375-3.072-3.072 0-1.696 1.375-3.07 3.072-3.07zm0 1.274c-.991 0-1.797.806-1.797 1.797 0 .992.806 1.798 1.797 1.798.99 0 1.797-.806 1.797-1.798 0-.99-.806-1.797-1.797-1.797zm0 7.654c1.696 0 3.07 1.375 3.07 3.072 0 1.696-1.374 3.071-3.07 3.071-1.697 0-3.072-1.375-3.072-3.071 0-1.697 1.375-3.072 3.072-3.072zm0 1.275c-.991 0-1.797.805-1.797 1.797 0 .991.806 1.797 1.797 1.797.99 0 1.797-.806 1.797-1.797 0-.992-.806-1.797-1.797-1.797zm0 7.653c1.696 0 3.07 1.376 3.07 3.072 0 1.696-1.374 3.072-3.07 3.072-1.697 0-3.072-1.376-3.072-3.072 0-1.696 1.375-3.072 3.072-3.072zm0 1.275c-.991 0-1.797.806-1.797 1.797 0 .991.806 1.797 1.797 1.797.99 0 1.797-.806 1.797-1.797 0-.991-.806-1.797-1.797-1.797zM37.5 7.501c1.696 0 3.072 1.374 3.072 3.07 0 1.697-1.376 3.072-3.072 3.072-1.696 0-3.072-1.375-3.072-3.072 0-1.696 1.376-3.07 3.072-3.07zm0 1.273c-.99 0-1.797.806-1.797 1.797 0 .992.806 1.798 1.797 1.798.991 0 1.797-.806 1.797-1.798 0-.99-.806-1.797-1.797-1.797zm0 7.654c1.696 0 3.072 1.375 3.072 3.072 0 1.696-1.376 3.071-3.072 3.071-1.696 0-3.072-1.375-3.072-3.071 0-1.697 1.376-3.072 3.072-3.072zm0 1.275c-.99 0-1.797.805-1.797 1.797 0 .991.806 1.797 1.797 1.797.991 0 1.797-.806 1.797-1.797 0-.992-.806-1.797-1.797-1.797zm0 7.653c1.696 0 3.072 1.376 3.072 3.072 0 1.696-1.376 3.072-3.072 3.072-1.696 0-3.072-1.376-3.072-3.072 0-1.696 1.376-3.072 3.072-3.072zm0 1.275c-.99 0-1.797.806-1.797 1.797 0 .991.806 1.797 1.797 1.797.991 0 1.797-.806 1.797-1.797 0-.991-.806-1.797-1.797-1.797zm8.928-19.13c1.697 0 3.072 1.374 3.072 3.07 0 1.697-1.375 3.072-3.072 3.072-1.696 0-3.07-1.375-3.07-3.072 0-1.696 1.374-3.07 3.07-3.07zm0 1.273c-.99 0-1.797.806-1.797 1.797 0 .992.806 1.798 1.797 1.798.991 0 1.798-.806 1.798-1.798 0-.99-.807-1.797-1.798-1.797zm0 7.654c1.697 0 3.072 1.375 3.072 3.072 0 1.696-1.375 3.071-3.072 3.071-1.696 0-3.07-1.375-3.07-3.071 0-1.697 1.374-3.072 3.07-3.072zm0 1.275c-.99 0-1.797.805-1.797 1.797 0 .991.806 1.797 1.797 1.797.991 0 1.798-.806 1.798-1.797 0-.992-.807-1.797-1.798-1.797zm0 7.653c1.697 0 3.072 1.376 3.072 3.072 0 1.696-1.375 3.072-3.072 3.072-1.696 0-3.07-1.376-3.07-3.072 0-1.696 1.374-3.072 3.07-3.072zm0 1.275c-.99 0-1.797.806-1.797 1.797 0 .991.806 1.797 1.797 1.797.991 0 1.798-.806 1.798-1.797 0-.991-.807-1.797-1.798-1.797z"/>
                </G>
            </G>
        </Svg>
    )
};

export {KeypadActive}