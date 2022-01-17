import React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';

const PauseVideo = ({width,height})=>{
    return(
        <Svg width={width?width:69} height={height?height:69} viewBox="0 0 69 69">
            <G fill="none" fill-rule="evenodd">
                <G>
                    <Circle cx="34.5" cy="34.5" r="28.5" fill="#000" opacity=".5"/>
                    <Path fill="#80A0FC" d="M41.193 25.348c.721 0 1.307.586 1.307 1.308v15.688c0 .723-.586 1.308-1.307 1.308-.723 0-1.308-.585-1.308-1.308V26.656c0-.722.585-1.308 1.308-1.308m-13.386 0c.72 0 1.308.586 1.308 1.308v15.688c0 .723-.587 1.308-1.308 1.308-.723 0-1.307-.585-1.307-1.308V26.656c0-.722.584-1.308 1.307-1.308"/>
                </G>
            </G>
        </Svg>
    )
};

export {PauseVideo}