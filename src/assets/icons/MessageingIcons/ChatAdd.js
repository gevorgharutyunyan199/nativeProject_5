import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const ChatAdd = ({width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G>
                    <Circle cx="16" cy="16" r="9" stroke="#6C92FB" strokeWidth=".8"/>
                    <Path fill="#6C92FB" d="M20.675 15.675h-4.35v-4.35c0-.18-.146-.325-.325-.325-.18 0-.325.145-.325.325v4.35h-4.35c-.18 0-.325.146-.325.325 0 .18.145.325.325.325h4.35v4.35c0 .18.146.325.325.325.18 0 .325-.145.325-.325v-4.35h4.35c.18 0 .325-.146.325-.325 0-.18-.145-.325-.325-.325"/>
                </G>
            </G>
        </Svg>
    )
};

export {ChatAdd}
