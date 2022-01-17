import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Back = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fill-rule="evenodd">
                <G fill={color?color:"#848A91"}>
                    <Path d="M18.87 24.5c-.223 0-.443-.09-.601-.25-.16-.16-.248-.373-.248-.6 0-.227.087-.442.249-.602l6.197-6.2H5.483c-.47 0-.851-.38-.851-.85 0-.467.381-.847.851-.847h18.984l-6.197-6.2c-.161-.16-.25-.373-.25-.6 0-.227.088-.441.249-.602.16-.16.374-.249.601-.249.228 0 .44.088.602.25l7.649 7.647c.075.076.137.168.184.273.084.213.084.448.002.653-.05.116-.114.209-.19.28l-7.645 7.648c-.158.158-.378.249-.602.249" transform="matrix(-1 0 0 1 32 0)"/>
                </G>
            </G>
        </Svg>
    )
};

export {Back}
