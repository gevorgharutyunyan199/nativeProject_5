import React from 'react';
import Svg, {Defs, Use, G, Path} from 'react-native-svg';

const ArrowRight = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 16 32">
            <Defs>
                <Path id="r8od3qlzha" d="M15.716 19.5c-.216 0-.403-.077-.554-.23L9.23 13.338c-.144-.143-.23-.35-.23-.554 0-.216.077-.402.23-.554.148-.148.345-.23.555-.23.21 0 .407.082.555.23l5.376 5.376 5.376-5.376c.148-.148.346-.23.555-.23.21 0 .407.082.555.23.148.148.23.345.23.554 0 .21-.082.407-.23.554L16.27 19.27c-.151.153-.338.23-.554.23"/>
            </Defs>
            <G fill="none" fillRule="evenodd">
                <G>
                    <Use fill={color?color:"#B4BAC2"} transform="rotate(-90 15.716 15.75)" xlinkHref={"#r8od3qlzha"}/>
                </G>
            </G>
        </Svg>
    )
};

export {ArrowRight}
