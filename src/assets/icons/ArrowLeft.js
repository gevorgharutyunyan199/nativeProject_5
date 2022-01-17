import React from 'react';
import Svg, {Defs, Use, G, Path} from 'react-native-svg';

const ArrowLeft = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 16 32">
            <Defs>
                <Path id="zx3wqpb4na" d="M3.716 19.5c-.216 0-.403-.077-.554-.23l-5.932-5.932c-.144-.143-.23-.35-.23-.554 0-.216.077-.402.23-.554.148-.148.345-.23.555-.23.21 0 .407.082.555.23l5.376 5.376 5.376-5.376c.148-.148.346-.23.555-.23.21 0 .407.082.555.23.148.148.23.345.23.554 0 .21-.082.407-.23.554L4.27 19.27c-.151.153-.338.23-.554.23"/>
            </Defs>
            <G fill="none" fill-rule="evenodd">
                <G>
                    <Use fill={color?color:"#6C92FB"} transform="matrix(0 -1 -1 0 19.466 19.466)" xlinkHref={"#zx3wqpb4na"}/>
                </G>
            </G>
        </Svg>
    )
};

export {ArrowLeft}
