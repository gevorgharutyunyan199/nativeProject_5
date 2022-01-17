import React from 'react';
import Svg, {G, Circle} from 'react-native-svg';

const TakeVideo = ({width,height})=>{
    return(
        <Svg width={width?width:69} height={height?height:69} viewBox="0 0 69 69">
            <G fill="none" fillRule="evenodd">
                <G>
                    <G>
                        <G transform="translate(-153 -608) translate(153 608)">
                            <Circle cx="34.5" cy="34.5" r="27.5" fill="#FD3B3F"/>
                            <Circle cx="34.5" cy="34.5" r="32.5" stroke="#FFF" strokeWidth="4"/>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {TakeVideo}
