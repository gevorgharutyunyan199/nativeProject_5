import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Clear = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G fill={color?color:"#B4BAC2"}>
                    <Path d="M23.075 23.075c-3.901 3.9-10.249 3.9-14.15 0-3.9-3.901-3.9-10.249 0-14.15 3.901-3.9 10.249-3.9 14.15 0 3.9 3.901 3.9 10.249 0 14.15m-3.158-11.976L16 15.016 12.083 11.1c-.272-.272-.712-.271-.984 0-.271.272-.271.712 0 .984L15.016 16 11.1 19.917c-.271.272-.271.712 0 .984.272.272.712.272.984 0L16 16.984l3.917 3.917c.272.272.712.272.984 0s.272-.712 0-.984L16.984 16l3.917-3.917c.272-.272.272-.712 0-.984-.272-.271-.712-.271-.984 0"/>
                </G>
            </G>
        </Svg>
    )
};

export {Clear}
