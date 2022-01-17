import React, {Component} from 'react';
import {KeyboardAvoidingView, View, FlatList, TouchableOpacity, Text, ScrollView} from 'react-native';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import styles from "./styles";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {TabScreenHeader} from "../../components/TabScreenHeader";
import {Check} from '../../assets/icons';
import {sizes} from "../../assets/sizes";
import Sound from "react-native-sound";

class ContactLabel extends Component {

    state = {
        screenName: '',
        selected: ''
    };

    componentDidMount() {
        const {route} = this.props;
        if(route.params.type === 'phoneNumbers' || route.params.type === 'emails' || route.params.type === 'addresses' || route.params.type === 'urls'){
            this.setState({
                screenName: 'Label',
                selected: route.params.selected
            })
        }else if(route.params.type === 'selectedTextTone'){
            this.setState({
                screenName: 'Text Tone',
                selected: route.params.selected
            })
        }else if(route.params.type === 'country'){
            this.setState({
                screenName: 'Country or Region',
                selected: route.params.selected
            })
        }
    }

    componentWillUnmount() {
        if(this.sound){
            this.sound.stop()
        }
    }

    save = ()=>{
        const {navigation, route} = this.props;
        const {selected} = this.state;
        route.params.changeLabel(route.params.type,route.params.index,selected);
        navigation.goBack()
    };

    playTone = (item)=>{
        if(this.sound){
            this.sound.stop()
        }
        Sound.setCategory('Playback');
        this.sound = new Sound(this.getToneUri(item),()=>{
            this.sound.play()
        });
    };

    getToneUri = (tone)=>{
        switch (tone) {
            case "Default":
                return require('../../assets/sound/Tones/Default.wav');
            case "None":
                return require('../../assets/sound/Tones/None.wav');
            case "Alert":
                return require('../../assets/sound/Tones/Alert.wav');
            case "Anticipate":
                return require('../../assets/sound/Tones/Anticipate.wav');
            case "Aurora":
                return require('../../assets/sound/Tones/Aurora.wav');
            case "Bamboo":
                return require('../../assets/sound/Tones/Bamboo.wav');
            case "Bell":
                return require('../../assets/sound/Tones/Bell.wav');
            case "Bloom":
                return require('../../assets/sound/Tones/Bloom.wav');
            case "Calypso":
                return require('../../assets/sound/Tones/Calypso.wav');
            case "Chime":
                return require('../../assets/sound/Tones/Chime.wav');
            case "Choo Choo":
                return require('../../assets/sound/Tones/ChooChoo.wav');
            case "Chord":
                return require('../../assets/sound/Tones/Chord.wav');
            case "Circles":
                return require('../../assets/sound/Tones/Circles.wav');
            case "Complete":
                return require('../../assets/sound/Tones/Complete.wav');
            case "Descent":
                return require('../../assets/sound/Tones/Descent.wav');
            case "Ding":
                return require('../../assets/sound/Tones/Ding.wav');
            case "Electronic":
                return require('../../assets/sound/Tones/Electronic.wav');
            case "Fanfare":
                return require('../../assets/sound/Tones/Fanfare.wav');
            case "Glass":
                return require('../../assets/sound/Tones/Glass.wav');
            case "Hello":
                return require('../../assets/sound/Tones/Hello.wav');
            case "Horn":
                return require('../../assets/sound/Tones/Horn.wav');
            case "Input":
                return require('../../assets/sound/Tones/Input.wav');
            case "Keys":
                return require('../../assets/sound/Tones/Keys.wav');
            case "Minuet":
                return require('../../assets/sound/Tones/Minuet.wav');
            case "News Flash":
                return require('../../assets/sound/Tones/NewsFlash.wav');
            case "Noir":
                return require('../../assets/sound/Tones/Noir.wav');
            case "Popcorn":
                return require('../../assets/sound/Tones/Popcorn.wav');
            case "Pulse":
                return require('../../assets/sound/Tones/Pulse.wav');
            case "Spell":
                return require('../../assets/sound/Tones/Spell.wav');
            case "Suspense":
                return require('../../assets/sound/Tones/Suspense.wav');
            case "Swoosh":
                return require('../../assets/sound/Tones/Swoosh.wav');
            case "Synth":
                return require('../../assets/sound/Tones/Synth.wav');
            case "Telegraph":
                return require('../../assets/sound/Tones/Telegraph.wav');
            case "Tri-tone":
                return require('../../assets/sound/Tones/Tri-tone.wav');
            case "Tweet":
                return require('../../assets/sound/Tones/Tweet.wav');
            case "Typewriters":
                return require('../../assets/sound/Tones/Typewriters.wav');
            case "Update":
                return require('../../assets/sound/Tones/Update.wav');
            case "Apex":
                return require('../../assets/sound/Tones/Apex.wav');
            case "Beacon":
                return require('../../assets/sound/Tones/Beacon.wav');
            case "Blues":
                return require('../../assets/sound/Tones/Blues.wav');
            case "Bulletin":
                return require('../../assets/sound/Tones/Bulletin.wav');
            case "By The Seaside":
                return require('../../assets/sound/Tones/ByTheSeaside.wav');
            case "Chimes":
                return require('../../assets/sound/Tones/Chimes.wav');
            case "Circuit":
                return require('../../assets/sound/Tones/Circuit.wav');
            case "Constellation":
                return require('../../assets/sound/Tones/Constellation.wav');
            case "Cosmic":
                return require('../../assets/sound/Tones/Cosmic.wav');
            case "Crystals":
                return require('../../assets/sound/Tones/Crystals.wav');
            case "Hillside":
                return require('../../assets/sound/Tones/Hillside.wav');
            case "Illuminate":
                return require('../../assets/sound/Tones/Illuminate.wav');
            case "Marimba":
                return require('../../assets/sound/Tones/Marimba.wav');
            case "Night Owl":
                return require('../../assets/sound/Tones/NightOwl.wav');
            case "Opening":
                return require('../../assets/sound/Tones/Opening.wav');
            case "Piano Riff":
                return require('../../assets/sound/Tones/PianoRiff.wav');
            case "Playtime":
                return require('../../assets/sound/Tones/Playtime.wav');
            case "Presto":
                return require('../../assets/sound/Tones/Presto.wav');
            case "Radar":
                return require('../../assets/sound/Tones/Radar.wav');
            case "Radiate":
                return require('../../assets/sound/Tones/Radiate.wav');
            case "Reflection":
                return require('../../assets/sound/Tones/Reflection.wav');
            case "Ripples":
                return require('../../assets/sound/Tones/Ripples.wav');
            case "Sencha":
                return require('../../assets/sound/Tones/Sencha.wav');
            case "Signal":
                return require('../../assets/sound/Tones/Signal.wav');
            case "Silk":
                return require('../../assets/sound/Tones/Silk.wav');
            case "Slow Rise":
                return require('../../assets/sound/Tones/SlowRise.wav');
            case "Sonar":
                return require('../../assets/sound/Tones/Sonar.wav');
            case "Stargaze":
                return require('../../assets/sound/Tones/Stargaze.wav');
            case "Summit":
                return require('../../assets/sound/Tones/Summit.wav');
            case "Trill":
                return require('../../assets/sound/Tones/Trill.wav');
            case "Twinkle":
                return require('../../assets/sound/Tones/Twinkle.wav');
            case "Uplift":
                return require('../../assets/sound/Tones/Uplift.wav');
            case "Waves":
                return require('../../assets/sound/Tones/Waves.wav');
            case "Xylophone":
                return require('../../assets/sound/Tones/Xylophone.wav');
            default:
                return require('../../assets/sound/Tones/Default.wav');
        }
    }

    render() {
        const {navigation, route, contactLabels} = this.props;
        const {screenName, selected} = this.state;

        let data = [];

        if(route.params.type === 'phoneNumbers'){
            data = contactLabels.phoneLabels
        }else if(route.params.type === 'emails'){
            data = contactLabels.emailLabels
        }else if(route.params.type === 'urls'){
            data = contactLabels.urlLabels
        }else if(route.params.type === 'selectedTextTone'){
            data = contactLabels.toneLabels
        }else if(route.params.type === 'addresses'){
            data = contactLabels.addressLabels
        }else if(route.params.type === 'country'){
            data = contactLabels.countryLabels
        }

        return(
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios ? "padding" : "height"}
            >
                <View style={styles.screen}>
                    <View style={styles.headerContainer}>
                        <TabScreenHeader
                            leftIcon={'cancel'}
                            leftIconPress={() => {
                                navigation.goBack()
                            }}
                            title={screenName}
                            rightIcon={'done'}
                            rightIconPress={this.save}
                        />
                    </View>
                    {route.params.type === 'selectedTextTone'?<TouchableOpacity style={styles.buttonContainer} onPress={()=>{
                        if(route.params.type === 'selectedTextTone'){
                            this.playTone('Default')
                        }
                        this.setState({
                            selected: 'Default'
                        })
                    }}>
                        <Text style={styles.buttonText}>Default</Text>
                        {selected === 'Default'?<Check width={sizes.size32} height={sizes.size32}/>:null}
                    </TouchableOpacity>:null}
                    {route.params.type === 'selectedTextTone'?<TouchableOpacity style={styles.buttonContainer} onPress={()=>{
                        if(route.params.type === 'selectedTextTone'){
                            this.playTone('None')
                        }
                        this.setState({
                            selected: 'None'
                        })
                    }}>
                        <Text style={styles.buttonText}>None</Text>
                        {selected === 'None'?<Check width={sizes.size32} height={sizes.size32}/>:null}
                    </TouchableOpacity>:null}
                    {route.params.type === 'selectedTextTone'?<ScrollView>
                        <Text style={styles.textTonesText}>RINGTONES</Text>
                        {
                            contactLabels.toneLabelsRingtones.map((item, index)=>{
                               return (
                                   <TouchableOpacity key={index.toString()} style={styles.buttonContainer} onPress={()=>{
                                       if(route.params.type === 'selectedTextTone'){
                                           this.playTone(item)
                                       }
                                       this.setState({
                                           selected: item
                                       })
                                   }}>
                                       <Text style={styles.buttonText}>{item}</Text>
                                       {selected === item?<Check width={sizes.size32} height={sizes.size32}/>:null}
                                   </TouchableOpacity>
                               )
                            })
                        }
                        <Text style={styles.textTonesText}>ALERT TONES</Text>
                        {
                            contactLabels.toneLabelsTones.map((item, index)=>{
                                return (
                                    <TouchableOpacity key={index.toString()} style={styles.buttonContainer} onPress={()=>{
                                        if(route.params.type === 'selectedTextTone'){
                                            this.playTone(item)
                                        }
                                        this.setState({
                                            selected: item
                                        })
                                    }}>
                                        <Text style={styles.buttonText}>{item}</Text>
                                        {selected === item?<Check width={sizes.size32} height={sizes.size32}/>:null}
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>:null}
                    {route.params.type !== 'selectedTextTone'?<FlatList
                        data={data}
                        renderItem={({item}) => {
                            return (
                                <TouchableOpacity style={styles.buttonContainer} onPress={()=>{
                                    if(route.params.type === 'selectedTextTone'){
                                        this.playTone(item)
                                    }
                                    this.setState({
                                        selected: item
                                    })
                                }}>
                                    <Text style={styles.buttonText}>{item}</Text>
                                    {selected === item?<Check width={sizes.size32} height={sizes.size32}/>:null}
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(item, index)=>index.toString()}
                    />:null}
                </View>
            </KeyboardAvoidingView>
        )
    }
}


const mapStateToProps = store => {
    return {
        contactLabels: store.ContactLabelsReducer
    }
};

export default connect(mapStateToProps, {makeAction})(ContactLabel)
