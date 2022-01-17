import React from 'react';
import Svg, {Defs, G, Path, TSpan, Stop, LinearGradient, Text} from 'react-native-svg';

const HistoryActive = ({width,height})=>{
    return(
        <Svg width={width?width:75} height={height?height:49} viewBox="0 0 75 49">
            <Defs>
                <LinearGradient id="32zaxnr1aa" x1="-76.001%" x2="134.986%" y1="105.687%" y2="0%">
                    <Stop offset="0%" stopColor="#6c92fb"/>
                    <Stop offset="100%" stopColor="#6c92fb"/>
                </LinearGradient>
            </Defs>
            <G fill="none" fillRule="evenodd">
                <G>
                    <Text fill="#3F4244" fontFamily="SFProText-Regular, SF Pro Text" fontSize="10">
                        <TSpan x="20.552" y="45.5">History</TSpan>
                    </Text>
                    <Path fill="url(#32zaxnr1aa)" d="M37.745 31.5c-6.441 0-11.805-4.924-12.214-11.21-.21-3.213.844-6.31 2.964-8.722C30.62 9.149 33.551 7.704 36.75 7.5c.396 0 .709.299.709.678 0 .415-.265.722-.644.747-2.897.189-5.624 1.592-7.48 3.846-1.878 2.28-2.702 5.165-2.321 8.123.614 4.741 4.503 8.58 9.25 9.13.42.049.842.073 1.257.073 3.655-.001 7.003-1.849 8.96-4.943.14-.224.378-.357.635-.357.078 0 .155.013.23.038.212.07.379.23.46.443.08.215.059.452-.057.653-1.815 3.111-4.878 5.06-8.625 5.49-.452.053-.916.079-1.378.079zm8.143-18.91c-.204 0-.403-.09-.545-.243-.154-.17-.315-.333-.478-.494-.248-.239-.301-.605-.128-.893.147-.242.38-.38.638-.38.188 0 .362.072.494.205.198.203.38.41.565.636.13.156.186.36.156.56-.03.2-.146.381-.317.495-.114.074-.248.114-.385.114zm-3.917-2.777c-.093 0-.185-.018-.272-.055-.382-.17-.783-.316-1.192-.438-.346-.103-.562-.43-.516-.775.048-.377.348-.65.716-.65.071 0 .142.011.21.031.434.132.86.296 1.34.517.353.164.517.569.372.921-.108.269-.373.45-.658.45zm6.625 12.38c-.197 0-.384-.085-.513-.234-.127-.147-.183-.34-.157-.533.073-.491.125-1.052.159-1.46.027-.351.323-.624.673-.624l.093.003c.183.007.352.088.476.228.121.136.18.313.166.498-.033.42-.087 1.032-.16 1.553-.048.325-.337.57-.67.57h-.067zm-.285-5.345c-.294 0-.554-.194-.649-.482-.104-.324-.225-.646-.358-.955-.127-.3-.016-.649.263-.83.15-.098.279-.141.414-.141.275 0 .522.162.63.414.155.365.286.731.398 1.117.055.195.023.402-.087.569-.11.166-.287.275-.485.297-.072.01-.1.011-.126.011zm-4.054 6.727c-.092 0-.183-.019-.273-.053L36.459 20.5c-.055-.024-.097-.055-.136-.084-.07-.047-.088-.059-.106-.077l-.05-.065c-.032-.04-.079-.097-.11-.166-.04-.15-.053-.214-.053-.277l-.002-5.845c0-.401.326-.728.727-.728.4 0 .727.327.727.728v5.25l7.071 2.936c.182.072.323.21.4.39.076.18.078.376.005.554-.111.279-.376.459-.675.459z"/>
                </G>
            </G>
        </Svg>
    )
};

export {HistoryActive}