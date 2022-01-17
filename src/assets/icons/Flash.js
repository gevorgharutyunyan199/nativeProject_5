import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Flash = ({width,height})=>{
    return(
        <Svg width={width?width:10} height={height?height:18} viewBox="0 0 10.025 17.692">
            <G transform="translate(-208.933 -81)">
                <G transform="translate(208.933 81)">
                    <Path d="M120.931,6.068a.3.3,0,0,0-.267-.17H117.17L120.618.453A.295.295,0,0,0,120.369,0h-4.718a.3.3,0,0,0-.264.163l-4.423,8.846a.295.295,0,0,0,.264.427h3.032l-3.3,7.847a.3.3,0,0,0,.5.3l9.436-11.2A.3.3,0,0,0,120.931,6.068Z" transform="translate(-110.933)" fill="#848A91"/>
                </G>
            </G>
        </Svg>
    )
};

export {Flash}
