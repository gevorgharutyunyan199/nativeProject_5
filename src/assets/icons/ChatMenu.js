import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const ChatMenu = ({width,height})=>{
    return(
        <Svg width={width?width:24} height={height?height:24} viewBox="0 0 24 24">
            <G fill="none" fillRule="evenodd">
                <G fill="#848A91">
                    <Path d="M10.707 17.707c0-.714.58-1.293 1.293-1.293.714 0 1.293.58 1.293 1.293 0 .714-.579 1.293-1.293 1.293s-1.293-.579-1.293-1.293zm0-5.707c0-.714.58-1.293 1.293-1.293.714 0 1.293.58 1.293 1.293 0 .714-.579 1.293-1.293 1.293s-1.293-.579-1.293-1.293zm0-5.707C10.707 5.58 11.287 5 12 5c.714 0 1.293.58 1.293 1.293 0 .714-.579 1.293-1.293 1.293s-1.293-.579-1.293-1.293z"/>
                </G>
            </G>
        </Svg>
    )
};

export {ChatMenu}
