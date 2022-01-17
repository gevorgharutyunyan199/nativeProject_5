import React from 'react';
import Svg, {G, Rect, Circle} from 'react-native-svg';

const Minus = ({width,height})=>{
    return(
        <Svg width={width?width:23} height={height?height:23} viewBox="0 0 23 23">
            <G id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <G id="Workspaces/1-with-minus-address" transform="translate(-22.000000, -124.000000)">
                    <G id="icons/add_plus-copy-2" transform="translate(17.000000, 119.000000)">
                        <G id="Group" transform="translate(6.000000, 6.000000)">
                            <Circle id="Oval" stroke="#FD3B3F" strokeWidth="0.8" fill="#FD3B3F" cx="10.5" cy="10.5" r="10.5"/>
                            <Rect id="Rectangle" fill="#FFFFFF" x="4.67" y="10" width="11.67" height="1.2" rx="0.6"/>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {Minus}
