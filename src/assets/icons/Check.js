import React from 'react';
import Svg, {G, Defs, Rect, Path, Use} from 'react-native-svg';

const Check = ({width,height})=>{
    return(
        <Svg width={width?width:32} height={height?height:32} viewBox="0 0 32 32">
            <Defs>
                <Rect id="6ashieyfia" width="25" height="25" x=".5" y=".5" rx="12.5"/>
                <Path id="7idx3wthub" d="M5.728 11.5c-.252 0-.488-.098-.666-.275L.43 6.648c-.174-.177-.27-.413-.269-.664.001-.25.1-.484.276-.657.177-.173.41-.269.658-.269.25 0 .487.098.665.277l3.977 3.91 8.515-8.47c.178-.177.413-.275.661-.275.25 0 .484.098.662.275.357.366.354.96-.01 1.323l-9.179 9.126c-.178.178-.412.276-.657.276"/>
            </Defs>
            <G fill="none" fill-rule="evenodd">
                <G>
                    <G>
                        <G transform="translate(3 3)">
                            <Use fill="#FFF" xlinkHref="#6ashieyfia"/>
                        </G>
                        <G transform="translate(3 3) translate(5 7)">
                            <Use fill="#7674FD" xlinkHref="#7idx3wthub"/>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>

    )
};

export {Check}
