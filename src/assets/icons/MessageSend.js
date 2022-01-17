import React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const MessageSend = ({width,height})=>{
    return(
        <Svg width={width?width:21} height={height?height:21} viewBox="0 0 20.594 20.594">
            <G transform="translate(-449 -1598)">
                <Path d="M10.3,0A10.3,10.3,0,1,1,0,10.3,10.308,10.308,0,0,1,10.3,0Z" transform="translate(449 1618.594) rotate(-90)" fill="#e6e9eb"/>
                <Path d="M7.845,35.648l-3.29-3.28a.166.166,0,0,0-.179-.036.164.164,0,0,0-.1.152v1.808H.164A.164.164,0,0,0,0,34.458v2.63a.164.164,0,0,0,.164.164h4.11v1.8a.165.165,0,0,0,.1.152.162.162,0,0,0,.063.012.166.166,0,0,0,.116-.048l3.29-3.289a.165.165,0,0,0,0-.233Z" transform="translate(455.57 1572.237)" fill="#fff"/>
            </G>
        </Svg>
    )
};

export {MessageSend}
