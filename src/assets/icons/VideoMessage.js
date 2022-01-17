import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const VideoMessage = ({color,width,height})=>{
    return(
        <Svg width={width?width:19} height={height?height:19} viewBox="0 0 19 19">
            <G fill="none" fillRule="evenodd">
                <G fill={color?color:"#848A91"}>
                    <Path d="M2.044 2.736C.981 2.736 0 3.585 0 4.78v9.442c0 1.194.98 2.043 2.044 2.043.354 0 .718-.094 1.058-.302l7.743-4.72c1.304-.795 1.304-2.689 0-3.484l-7.743-4.72c-.34-.208-.704-.302-1.058-.302m0 .866c.213 0 .417.059.608.175l7.742 4.72c.358.219.563.584.563 1.003 0 .42-.205.785-.563 1.002l-7.742 4.721c-.19.116-.395.176-.608.176-.567 0-1.178-.45-1.178-1.178V4.779c0-.727.611-1.177 1.178-1.177"/>
                </G>
            </G>
        </Svg>
    )
};

export {VideoMessage}
