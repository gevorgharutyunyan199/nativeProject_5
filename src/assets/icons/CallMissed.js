import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const CallMissed = ({color,width,height})=>{
    return(
        <Svg width={width?width:30} height={height?height:30} viewBox="0 0 30 30">
            <G fill="none" fillRule="evenodd">
                <G fill="#FD3B3F">
                    <Path d="M8.516 10L1.979 16.537 1.979 10.988 0 10.987 0 20 9.013 20 9.012 18.021 3.463 18.021 10 11.484z"/>
                </G>
            </G>
        </Svg>
    )
};

export {CallMissed}
