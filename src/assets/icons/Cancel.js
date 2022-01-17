import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Cancel = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fill-rule="evenodd">
                <G fill={color?color:"#848A91"}>
                    <Path d="M22.45 8.587L16 15.037l-6.45-6.45c-.266-.266-.697-.266-.963 0s-.266.697 0 .963l6.45 6.45-6.45 6.45c-.266.266-.266.698 0 .963.266.266.697.266.963 0l6.45-6.45 6.45 6.45c.266.266.697.266.963 0 .266-.265.266-.697 0-.963L16.963 16l6.45-6.45c.266-.265.266-.697 0-.963s-.697-.266-.963 0"/>
                </G>
            </G>
        </Svg>
    )
};

export {Cancel}
