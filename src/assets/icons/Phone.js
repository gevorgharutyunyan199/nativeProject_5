import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const Phone = ({width,height})=>{
    return(
        <Svg width={width?width:40} height={height?height:40} viewBox="0 0 40 40">
            <G fill="none" fillRule="evenodd">
                <G>
                    <Circle cx="20" cy="20" r="18.5" fill="#EDEFF0"/>
                    <Path fill="#6C92FB" d="M23.981 29.036c-2.698 0-5.203-1.214-6.872-3.33l-2.233-2.83c-2.804-3.556-2.402-8.63.79-11.709.308-.297.807-.264 1.07.075l2.3 2.97c.188.238.203.555.038.771-1.466 1.911-1.543 4.55-.18 6.276l.72.913c.887 1.125 2.295 1.77 3.865 1.77.214 0 .43-.012.644-.037l.193-.024c.486-.074.954-.207 1.391-.397.06-.026.123-.044.187-.054.046-.005.075-.008.105-.008.193 0 .369.084.484.228l2.363 2.997c.27.34.174.837-.197 1.062-1.037.63-2.183 1.05-3.356 1.228-.105.016-.21.03-.312.041-.335.039-.671.058-1 .058"/>
                </G>
            </G>
        </Svg>
    )
};

export {Phone}
