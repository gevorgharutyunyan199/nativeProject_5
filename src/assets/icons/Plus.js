import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Plus = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fill-rule="evenodd">
                <G fill={color?color:"#848A91"}>
                    <Path d="M25.818 15.318h-9.136V6.182c0-.377-.305-.682-.682-.682-.377 0-.682.305-.682.682v9.136H6.182c-.377 0-.682.305-.682.682 0 .377.305.682.682.682h9.136v9.136c0 .377.305.682.682.682.377 0 .682-.305.682-.682v-9.136h9.136c.377 0 .682-.305.682-.682 0-.377-.305-.682-.682-.682"/>
                </G>
            </G>
        </Svg>
    )
};

export {Plus}
