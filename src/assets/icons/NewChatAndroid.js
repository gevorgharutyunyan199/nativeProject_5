import React from 'react';
import Svg, {G, Path, Circle} from 'react-native-svg';

const NewChatAndroid = ({width,height})=>{
    return(
        <Svg width={width?width:62} height={height?height:62} viewBox="0 0 62 62">
            <G fill="none" fillRule="evenodd">
                <G>
                    <G transform="translate(-276 -572) translate(276 572)">
                        <Circle cx="31" cy="31" r="31" fill="#6C92FB"/>
                        <Path fill="#FFF" d="M20.597 21H41.15c.881 0 1.597.717 1.597 1.597V35.82c0 .88-.716 1.597-1.597 1.597l-5.426.026-4.04 4.166-4.23-4.192h-6.857c-.88 0-1.597-.717-1.597-1.597V22.597c0-.88.716-1.597 1.597-1.597zm8.01 5.767h8.76c.4 0 .726-.325.726-.726 0-.4-.325-.725-.726-.725h-8.76c-.4 0-.725.325-.725.725 0 .4.325.726.726.726zm-4.228 0h1.46c.4 0 .725-.325.725-.726 0-.4-.325-.725-.725-.725h-1.46c-.4 0-.726.325-.726.725 0 .4.325.726.726.726zm0 6.335h12.988c.4 0 .726-.326.726-.727 0-.4-.326-.724-.726-.724H24.379c-.4 0-.726.325-.726.724 0 .4.325.727.726.727z"/>
                    </G>
                </G>
            </G>
        </Svg>
    )
};

export {NewChatAndroid}
