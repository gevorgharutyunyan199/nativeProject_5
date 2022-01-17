import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const Add = ({width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G>
                    <G transform="translate(6 6)">
                        <Circle cx="10.5" cy="10.5" r="10.5" fill="#6C92FB" stroke="#6C92FB" strokeWidth=".8"/>
                        <Path fill="#FFF" stroke="#FFF" strokeWidth=".3" d="M15.954 10.121H10.88V5.046c0-.21-.17-.38-.379-.38-.21 0-.379.17-.379.38v5.075H5.046c-.21 0-.38.17-.38.379 0 .21.17.379.38.379h5.075v5.075c0 .21.17.38.379.38.21 0 .379-.17.379-.38V10.88h5.075c.21 0 .38-.17.38-.379 0-.21-.17-.379-.38-.379"/>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {Add}
