import React from 'react';
import Svg, {Defs, G, Path, TSpan, Stop, LinearGradient, Text, Mask, Use} from 'react-native-svg';

const ContactsActive = ({width,height})=>{
    return(
        <Svg width={width?width:75} height={height?height:49} viewBox="0 0 75 49">
            <Defs>
                <LinearGradient id="xmqh59nkmc" x1="0%" x2="113.832%" y1="100%" y2="-14.632%">
                    <Stop offset="0%" stopColor="#6c92fb"/>
                    <Stop offset="100%" stopColor="#6c92fb"/>
                </LinearGradient>
                <LinearGradient id="20zecevmgd" x1="-10.921%" x2="100%" y1="112.094%" y2="0%">
                    <Stop offset="0%" stopColor="#6c92fb" stopOpacity=".992"/>
                    <Stop offset="100%" stopColor="#6c92fb"/>
                </LinearGradient>
                <Path id="py5hr4byca" d="M10.812 1.253c-4.343 0-7.877 3.534-7.877 7.878 0 4.343 3.534 7.876 7.877 7.876 4.344 0 7.877-3.533 7.877-7.876 0-4.344-3.533-7.878-7.877-7.878m0 17.007c-5.034 0-9.13-4.095-9.13-9.13 0-5.034 4.096-9.13 9.13-9.13 5.035 0 9.131 4.096 9.131 9.13 0 5.035-4.096 9.13-9.13 9.13zM18.877 24H1.155c-.346 0-.627-.281-.627-.627s.281-.626.627-.626h17.722c.346 0 .627.28.627.626s-.28.627-.627.627zm.227-22.602c0-.454.47-.76.882-.572 3.143 1.439 5.33 4.622 5.33 8.309 0 3.678-2.187 6.862-5.331 8.294-.412.187-.881-.12-.881-.573 0-.241.139-.463.358-.564 2.716-1.24 4.603-3.983 4.603-7.157 0-3.183-1.887-5.928-4.603-7.167-.22-.1-.358-.322-.358-.563v-.007zM25.845 24h-3.471c-.347 0-.627-.281-.627-.627s.28-.626.627-.626h3.471c.346 0 .627.28.627.626s-.28.627-.627.627z"/>
            </Defs>
            <G fill="none" fill-rule="evenodd">
                <G>
                    <G transform="translate(24 7.5)">
                        <Mask id="p11johz8tb" fill="#fff">
                            <Use xlinkHref="#py5hr4byca"/>
                        </Mask>
                        <Use fill="#6c92fb" xlinkHref="#py5hr4byca"/>
                        <G mask="url(#p11johz8tb)">
                            <G>
                                <Path fill="url(#xmqh59nkmc)" d="M0.048 0.066L33.952 0.066 33.952 28.984 0.048 28.984z" transform="translate(-1.06 -2.904)"/>
                                <Path fill="url(#20zecevmgd)" d="M0.048 0.041L33.952 0.041 33.952 28.959 0.048 28.959z" transform="translate(-1.06 -2.904)"/>
                            </G>
                        </G>
                    </G>
                    <Text fill="#3F4244" fontFamily="SFProText-Regular, SF Pro Text" fontSize="10">
                        <TSpan x="16.243" y="45.5">Contacts</TSpan>
                    </Text>
                </G>
            </G>
        </Svg>
    )
};

export {ContactsActive}
