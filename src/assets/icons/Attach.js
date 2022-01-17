import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Attach = ({width,height,color})=>{
    return(
        <Svg width={width?width:22} height={height?height:21} viewBox="0 0 20.898 21.545">
            <G transform="translate(-139.961 -82) rotate(74)">
                <G transform="translate(121.823 -127.355)">
                    <Path d="M15.978,28.742a5.642,5.642,0,0,1-7.97,0L1.177,21.91a4.025,4.025,0,0,1,5.693-5.693l6.262,6.262A2.415,2.415,0,1,1,9.716,25.9L5.621,21.8a.805.805,0,1,1,1.139-1.139l4.1,4.1a.805.805,0,1,0,1.138-1.138L5.731,17.356a2.415,2.415,0,0,0-3.416,3.416L9.147,27.6a4.025,4.025,0,1,0,5.693-5.693L8.008,15.079A.805.805,0,0,1,9.147,13.94l6.831,6.831a5.635,5.635,0,0,1,0,7.97Z" transform="translate(0 -13.704)" fill={color?color:"#848A91"}/>
                </G>
            </G>
        </Svg>
    )
};

export {Attach}
