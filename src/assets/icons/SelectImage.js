import React from 'react';
import Svg, {G, Path, Circle, Defs, Use} from 'react-native-svg';

const SelectImage = ({width,height})=>{
    return(
        <Svg width={width?width:69} height={height?height:69} viewBox="0 0 69 69">
            <Defs>
                <Path id="nauly752la" d="M31.098 43c-.366 0-.71-.142-.968-.4l-6.74-6.657c-.252-.258-.391-.601-.39-.966.001-.365.144-.705.4-.956.258-.252.598-.39.957-.39.365 0 .71.142.969.401l5.785 5.688L43.496 27.4c.258-.258.6-.4.962-.4s.703.142.961.4c.52.532.516 1.396-.012 1.924L32.054 42.6c-.259.259-.599.401-.956.401"/>
            </Defs>
            <G fill="none" fillRule="evenodd">
                <G>
                    <G fill="#6C92FB" transform="translate(9 9)">
                        <Circle cx="25.5" cy="25.5" r="25"/>
                    </G>
                    <Use fill="#FFF" xlinkHref="#nauly752la"/>
                </G>
            </G>
        </Svg>
    )
};

export {SelectImage}
