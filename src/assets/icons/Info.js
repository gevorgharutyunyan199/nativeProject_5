import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const Info = ({color,width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G>
                    <G transform="matrix(1 0 0 -1 7 25)">
                        <Path fill={color?color:'#6C92FB'} d="M9.017 11.83c.285 0 .516-.238.516-.517V4.517c0-.285-.231-.517-.516-.517-.286 0-.517.232-.517.517v6.796c0 .28.23.516.517.516"/>
                        <Circle cx="9" cy="9" r="9" stroke={color?color:'#6C92FB'} strokeWidth="1.2"/>
                        <Path fill={color?color:'#6C92FB'} d="M9.02 13c-.397 0-.72.323-.72.72 0 .398.323.721.72.721.399 0 .721-.323.721-.72 0-.398-.322-.721-.72-.721"/>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {Info}
