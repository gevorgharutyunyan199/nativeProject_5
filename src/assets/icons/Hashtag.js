import React from 'react';
import Svg, {Path, G} from 'react-native-svg';

const Hashtag = ({width,height})=>{
    return(
        <Svg width={width?width:18} height={height?height:17} viewBox="0 0 18 17">
            <G fill="none" fillRule="evenodd" strokeLinecap="square">
                <G stroke="#3F4244" strokeWidth="2.5">
                    <G>
                        <G>
                            <G>
                                <Path d="M264.438 25v-9h3.937-3.938v-3.938V16h-9v-3.938V16H251.5h3.938v9H251.5h3.938v-9h9v9h-9v3.938V25h9zm0 0v3.938V25h3.937-3.938z" transform="translate(-302 -547) translate(38.5 253) translate(12.5 282)"/>
                            </G>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {Hashtag}
