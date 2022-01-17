import React from 'react';
import Svg, {G, Defs, Path, Circle, Use} from 'react-native-svg';

const SendMessage = ({width,height})=>{
    return(
        <Svg width={width?width:53} height={height?height:53} viewBox="0 0 53 53">
            <Defs>
                <Path id="ym757fiwya" d="M37.428 27.684l-18.805 8.325c-.174.077-.353.116-.53.116-.385 0-.765-.188-1.016-.503-.173-.218-.355-.583-.238-1.087l1.68-7.307h9.128c.407 0 .737-.33.737-.737 0-.408-.33-.738-.737-.738h-9.133l-1.676-7.288c-.116-.504.066-.87.24-1.087.25-.316.63-.504 1.015-.504.177 0 .356.04.53.117l18.805 8.325c.714.317.77.986.77 1.184 0 .198-.056.867-.77 1.184m.597-3.716L19.22 15.642c-.376-.166-.758-.242-1.128-.242-1.679 0-3.112 1.573-2.692 3.396l1.767 7.682c0 .005-.003.008-.003.013 0 .007.005.013.005.022l-1.77 7.692c-.42 1.822 1.014 3.395 2.693 3.395.37 0 .752-.076 1.128-.242l18.804-8.326c2.198-.973 2.198-4.091 0-5.064"/>
            </Defs>
            <G fill="none" fillRule="evenodd">
                <G>
                    <G transform="translate(-306 -100) translate(306 100)">
                        <Circle cx="26.5" cy="26.5" r="26.5" fill="#6C92FB"/>
                        <Use fill="#FFF" xlinkHref="#ym757fiwya"/>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {SendMessage}