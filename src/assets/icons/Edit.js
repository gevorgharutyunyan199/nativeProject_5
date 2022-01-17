import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Edit = ({width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G fill="#3F4244" stroke="#3F4244" strokeWidth=".3">
                    <Path d="M9.426 20.948c-.325-.233-.4-.689-.166-1.014l9.782-13.631c.234-.326.69-.4 1.015-.167.328.235.401.69.168 1.015L10.44 20.782c-.234.326-.687.402-1.015.166zM.708 24.19h11.116c.392 0 .708.317.708.708 0 .392-.316.707-.708.707H.708c-.39 0-.708-.316-.708-.707 0-.39.318-.708.708-.708zm20.695.708c0 .39-.318.707-.708.707h-4.476c-.391 0-.708-.316-.708-.707 0-.39.317-.708.708-.708h4.476c.39 0 .708.318.708.708z"/>
                </G>
            </G>
        </Svg>
    )
};

export {Edit}
