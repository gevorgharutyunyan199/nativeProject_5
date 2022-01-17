import React from 'react';
import Svg, {G, Path, Defs, Use, Circle} from 'react-native-svg';

const ControlDelete = ({color,width,height})=>{
    return(
        <Svg width={width?width:35} height={height?height:35} viewBox="0 0 35 35">
            <Defs>
                <Path id="wvlnggd9aa" d="M22.201 21.786c-.24 1.18-1.325 2.036-2.58 2.036h-3.366c-1.256 0-2.342-.856-2.581-2.036l-1.856-9.138h12.239L22.2 21.786zm3.618-9.982c.201 0 .386.13.422.326.056.267-.15.498-.411.498h-.89l-1.893 9.323c-.32 1.577-1.756 2.716-3.427 2.716h-3.365c-1.67 0-3.107-1.139-3.427-2.716l-1.894-9.323h-.889c-.262 0-.467-.231-.41-.498.035-.196.22-.326.42-.326H25.82zM15.442 10.45c-.233 0-.422-.185-.422-.413 0-.227.189-.412.422-.412h4.995c.233 0 .422.185.422.412 0 .228-.189.413-.422.413h-4.995zm-.002 7.615h4.995c.233 0 .422-.185.422-.412 0-.228-.19-.413-.422-.413H15.44c-.233 0-.422.185-.422.413 0 .227.19.412.422.412"/>
            </Defs>
            <G fill="none" fillRule="evenodd">
                <G>
                    <G>
                        <G>
                            <G transform="translate(-256 -377) translate(0 133) translate(256 244)">
                                <Circle cx="17.5" cy="17.5" r="16.9" stroke="#E6E9EB" strokeWidth="1.2"/>
                                <Use fill="#FD3B3F" xlinkHref="#wvlnggd9aa"/>
                            </G>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {ControlDelete}
