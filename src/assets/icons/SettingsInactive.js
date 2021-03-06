import React from 'react';
import Svg, {Text, G, Path, TSpan} from 'react-native-svg';

const SettingsInactive = ({width,height})=>{
    return(
        <Svg width={width?width:75} height={height?height:49} viewBox="0 0 75 49">
            <G fill="none" fillRule="evenodd">
                <G>
                    <Text fill="#848A91" fontFamily="SFProText-Regular, SF Pro Text" fontSize="10">
                        <TSpan x="18.013" y="45.5">Settings</TSpan>
                    </Text>
                    <Path fill="#CACED1" d="M37.5 22.406c-1.602 0-2.905-1.304-2.905-2.906s1.303-2.905 2.905-2.905c1.602 0 2.905 1.303 2.905 2.905 0 1.602-1.303 2.906-2.905 2.906m0-7.141c-2.335 0-4.235 1.9-4.235 4.235 0 2.335 1.9 4.235 4.235 4.235 2.335 0 4.235-1.9 4.235-4.235 0-2.335-1.9-4.235-4.235-4.235m0 14.5c-5.66 0-10.264-4.605-10.264-10.265S31.84 9.236 37.5 9.236c5.66 0 10.264 4.604 10.264 10.264 0 5.66-4.604 10.264-10.264 10.264m12.834-10.93h-1.255l-.02-.26c-.192-2.438-1.137-4.716-2.732-6.588l-.17-.2.89-.887c.126-.126.196-.293.196-.472 0-.178-.07-.346-.196-.472s-.294-.195-.472-.195-.345.07-.472.196l-.89.886-.199-.168c-1.87-1.594-4.147-2.538-6.585-2.732l-.26-.02V6.668c0-.369-.3-.669-.669-.669-.367 0-.666.3-.666.67V7.92l-.26.02c-2.44.195-4.718 1.14-6.589 2.733l-.198.169-.888-.888c-.126-.126-.293-.195-.472-.195-.178 0-.346.07-.472.195-.126.126-.195.294-.195.472 0 .179.07.346.195.472l.888.888-.17.199c-1.593 1.87-2.537 4.148-2.731 6.588l-.02.26h-1.253c-.369 0-.669.299-.669.666 0 .37.3.67.669.67h1.252l.02.26c.195 2.437 1.14 4.715 2.732 6.585l.17.198-.888.89c-.26.26-.26.684 0 .945.126.126.293.195.471.195.179 0 .347-.07.473-.195l.887-.89.2.169c1.872 1.595 4.15 2.54 6.587 2.732l.26.02v1.255c0 .367.3.666.667.666.369 0 .67-.299.67-.666v-1.255l.26-.02c2.435-.192 4.712-1.137 6.584-2.732l.2-.17.89.89c.126.127.293.196.47.196.18 0 .347-.07.473-.196.26-.26.26-.683 0-.944l-.89-.89.17-.198c1.595-1.873 2.54-4.15 2.732-6.585l.02-.26h1.255c.367 0 .666-.3.666-.67 0-.367-.299-.666-.666-.666"/>
                </G>
            </G>
        </Svg>
    )
};

export {SettingsInactive}
