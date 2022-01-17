import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Chat = ({width,height,color})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G fill={color?color:"#848A91"}>
                    <Path d="M25.802 13.306c.386 0 .698.311.698.696v9.31c0 1.753-1.435 3.188-3.188 3.188H8.686c-1.76 0-3.186-1.426-3.186-3.185V8.688C5.5 6.935 6.935 5.5 8.688 5.5h9.275c.386 0 .697.313.697.698 0 .385-.311.697-.697.697H8.816c-1.06 0-1.919.86-1.919 1.919v14.373c0 1.06.86 1.919 1.92 1.919h14.369c1.059 0 1.917-.86 1.917-1.919v-9.185c0-.385.313-.696.698-.696h.001zm-12.16 5.053c-.279-.277-.279-.73 0-1.008L25.281 5.71c.278-.279.73-.279 1.009 0 .279.279.278.73 0 1.009l-11.64 11.64c-.279.278-.73.28-1.01 0z"/>
                </G>
            </G>
        </Svg>
    )
};

export {Chat}
