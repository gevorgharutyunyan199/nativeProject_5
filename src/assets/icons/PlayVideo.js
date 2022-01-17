import React from 'react';
import Svg, {G, Circle, Path} from 'react-native-svg';

const PlayVideo = ({width,height})=>{
    return(
        <Svg width={width?width:69} height={height?height:69} viewBox="0 0 69 69">
            <G fill="none" fill-rule="evenodd">
                <G>
                    <Circle cx="34.5" cy="34.5" r="28.5" fill="#000" opacity=".5"/>
                    <Path fill="#80A1FD" d="M30.196 43.626c-.935 0-1.696-.741-1.696-1.652V27.026c0-.91.76-1.652 1.696-1.652.306 0 .609.083.875.243l12.616 7.472c.51.303.813.83.813 1.411 0 .581-.304 1.109-.813 1.41l-12.616 7.475c-.267.158-.57.241-.875.241"/>
                </G>
            </G>
        </Svg>
    )
};

export {PlayVideo}
