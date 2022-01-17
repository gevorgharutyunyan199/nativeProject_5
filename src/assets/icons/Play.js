import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Play = ({width,height, color})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G fill={color?color:'#6C92FB'}>
                    <Path d="M11.313 7.887c-1.29 0-2.478 1.018-2.478 2.451v11.324c0 1.433 1.188 2.45 2.478 2.45.429 0 .87-.112 1.282-.361l9.384-5.662c1.581-.954 1.581-3.224 0-4.178L12.595 8.25c-.412-.248-.853-.362-1.282-.362m0 1.04c.257 0 .505.07.736.209l9.384 5.662c.434.261.683.7.683 1.202 0 .503-.25.941-.683 1.202l-9.384 5.663c-.23.139-.479.21-.736.21-.688 0-1.428-.54-1.428-1.413V10.338c0-.872.74-1.412 1.428-1.412"/>
                </G>
            </G>
        </Svg>
    )
};

export {Play}
