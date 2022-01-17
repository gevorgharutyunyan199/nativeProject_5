import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const Message = ({width,height})=>{
    return(
        <Svg width={width?width:40} height={height?height:40} viewBox="0 0 40 40">
            <G fill="none" fillRule="evenodd">
                <G>
                    <Circle cx="20" cy="20" r="18.5" fill="#EDEFF0"/>
                    <Path fill="#6C92FB" d="M25.944 18.906l.027-.02 3.307-2.032v8.904c0 .824-.668 1.492-1.492 1.492H12.213c-.823 0-1.492-.668-1.492-1.492v-8.904l3.309 2.032.856.527 4.699 2.896c.122.08.263.121.418.121.149 0 .29-.04.413-.115l5.528-3.409zm1.843-6.156c.823 0 1.492.668 1.492 1.492v.75l-4.165 2.564-5.11 3.153-5.117-3.153-4.165-2.565v-.75c0-.823.668-1.491 1.492-1.491h15.573z"/>
                </G>
            </G>
        </Svg>
    )
};

export {Message}
