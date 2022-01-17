import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const Pause = ({width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <G fill="none" fillRule="evenodd">
                <G fill="#6C92FB">
                    <Path d="M20.612 24.115c-.849 0-1.54-.692-1.54-1.54V9.424c0-.849.691-1.54 1.54-1.54h.755c.848 0 1.54.691 1.54 1.54v13.15c0 .848-.692 1.54-1.54 1.54h-.755zm0-15.173c-.267 0-.483.217-.483.484v13.148c0 .267.216.485.483.485h.755c.266 0 .483-.218.483-.485V9.426c0-.267-.217-.484-.483-.484h-.755zm-9.98 0c-.266 0-.483.217-.483.484v13.148c0 .267.217.485.484.485h.753c.267 0 .485-.218.485-.485V9.426c0-.267-.218-.484-.485-.484h-.753zm0 15.173c-.848 0-1.54-.692-1.54-1.54V9.424c0-.849.692-1.54 1.54-1.54h.754c.85 0 1.541.691 1.541 1.54v13.15c0 .848-.692 1.54-1.54 1.54h-.754z"/>
                </G>
            </G>
        </Svg>
    )
};

export {Pause}