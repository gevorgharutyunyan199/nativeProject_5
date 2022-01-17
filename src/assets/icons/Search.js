import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Search = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fill-rule="evenodd">
                <G fill={color?color:"#848A91"}>
                    <Path d="M10.596 10.585c-2.676 2.676-2.676 7.03 0 9.707 2.677 2.676 7.031 2.676 9.708 0 2.676-2.676 2.676-7.03 0-9.707-2.677-2.676-7.031-2.676-9.708 0M20.65 21.442c-3.117 2.703-7.855 2.574-10.816-.387-3.097-3.097-3.097-8.136 0-11.232 3.097-3.097 8.135-3.097 11.232 0 2.97 2.969 3.091 7.724.366 10.84l2.895 2.894c.215.216.215.566 0 .781-.216.216-.565.216-.781 0l-2.896-2.896z"/>
                </G>
            </G>
        </Svg>
    )
};

export {Search}
