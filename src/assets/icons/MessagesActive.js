import React from 'react';
import Svg, {Defs, G, Path, TSpan, Stop, LinearGradient, Text} from 'react-native-svg';

const MessagesActive = ({width,height})=>{
    return(
        <Svg width={width?width:75} height={height?height:49} viewBox="0 0 75 49">
            <Defs>
                <LinearGradient id="icld7zhu5a" x1="-76.001%" x2="134.986%" y1="105.687%" y2="0%">
                    <Stop offset="0%" stopColor="#6c92fb"/>
                    <Stop offset="100%" stopColor="#6c92fb"/>
                </LinearGradient>
            </Defs>
            <G fill="none" fillRule="evenodd">
                <G>
                    <Text fill="#3F4244" fontFamily="SFProText-Regular, SF Pro Text" fontSize="10">
                        <TSpan x="13.76" y="45.5">Messages</TSpan>
                    </Text>
                    <Path fill="url(#icld7zhu5a)" d="M27.076 8.931c-.893 0-1.62.728-1.62 1.62v13.413c0 .893.727 1.62 1.62 1.62h6.956l4.29 4.252 4.098-4.225 5.504-.027c.893 0 1.62-.727 1.62-1.62V10.552c0-.893-.727-1.62-1.62-1.62H27.076zM38.258 31.5c-.19 0-.37-.075-.505-.21l-4.302-4.3-6.345.025c-1.699 0-3.081-1.382-3.081-3.082V10.582c0-1.7 1.382-3.082 3.08-3.082h20.79c1.698 0 3.08 1.382 3.08 3.082v13.351c0 1.7-1.382 3.082-3.08 3.082h-4.892l-4.238 4.275c-.135.135-.315.21-.507.21zm-3.056-16.72h8.885c.406 0 .736-.329.736-.735 0-.406-.33-.736-.736-.736h-8.885c-.407 0-.736.33-.736.736 0 .406.33.736.736.736zm-4.29 0h1.481c.406 0 .736-.329.736-.735 0-.406-.33-.736-.736-.736h-1.481c-.406 0-.736.33-.736.736 0 .406.33.736.736.736zm0 6.427h13.174c.407 0 .737-.33.737-.737 0-.405-.33-.735-.737-.735H30.912c-.406 0-.736.33-.736.735 0 .406.33.737.736.737z"/>
                </G>
            </G>
        </Svg>
    )
};

export {MessagesActive}
