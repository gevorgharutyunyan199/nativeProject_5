import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const ContactMessage = ({width,height})=>{
    return(
        <Svg width={width?width:40} height={height?height:40} viewBox="0 0 40 40">
            <G fill="none" fillRule="evenodd">
                <G>
                    <Circle cx="20" cy="20" r="18.5" fill="#EDEFF0"/>
                    <Path fill="#6C92FB" d="M12.078 12h16.456c.705 0 1.278.574 1.278 1.279v10.586c0 .705-.573 1.279-1.278 1.279l-4.345.02-3.234 3.336-3.386-3.356h-5.49c-.706 0-1.279-.574-1.279-1.279V13.28c0-.705.573-1.279 1.278-1.279zm6.414 4.617h7.013c.32 0 .58-.26.58-.581 0-.32-.26-.58-.58-.58h-7.013c-.32 0-.58.26-.58.58 0 .32.26.58.58.58zm-3.386 0h1.17c.32 0 .58-.26.58-.581 0-.32-.26-.58-.58-.58h-1.17c-.32 0-.58.26-.58.58 0 .32.26.58.58.58zm0 5.072h10.399c.32 0 .581-.261.581-.582 0-.32-.26-.58-.581-.58H15.106c-.32 0-.58.26-.58.58 0 .321.26.582.58.582z"/>
                </G>
            </G>
        </Svg>
    )
};

export {ContactMessage}
