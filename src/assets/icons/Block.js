import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Block = ({width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G fill="#3F4244" stroke="#3F4244" strokeWidth=".3">
                    <Path d="M10.485 7.175c-2.49 0-4.83.967-6.586 2.724C.427 13.37.254 18.977 3.504 22.664l13.158-13.21c-1.703-1.452-3.897-2.279-6.177-2.279zM4.338 23.546c1.702 1.451 3.895 2.279 6.175 2.279 2.491 0 4.83-.968 6.588-2.724 3.462-3.463 3.644-9.05.419-12.737L4.338 23.546zM10.5 27c-2.81 0-5.448-1.09-7.428-3.072-4.096-4.096-4.096-10.76 0-14.857C5.052 7.091 7.69 6 10.499 6c2.809 0 5.447 1.09 7.429 3.072C19.909 11.052 21 13.692 21 16.5c0 2.81-1.09 5.448-3.072 7.428C15.946 25.91 13.308 27 10.5 27z"/>
                </G>
            </G>
        </Svg>
    )
};

export {Block}
