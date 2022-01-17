import React, {useContext, useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ImageBackground,
    SectionList,
    Linking,
    Image,
    ActivityIndicator,
} from 'react-native';
import styles from './styles';
import {DeviceInfo} from "../../assets/DeviceInfo";
import Video from 'react-native-video';
import {sizes} from "../../assets/sizes";
import {Play} from "../../assets/icons";
import {Colors} from "../../assets/RootStyles";
import {TabScreenHeader, Preview} from "../../components";
import AppContext from "../../AppContext";
import History from "../History";
import Modal from 'react-native-modalbox';
import RNFetchBlob from 'rn-fetch-blob';
import {FFmpegKit} from 'ffmpeg-kit-react-native';

const RenderListItem = ({ section, index, openModal, item }) => {
    const [duration, setDuration] = useState('00:00');
    const [uri, setUri] = useState(item.asset_url);
    const [downloadStatus, setDownloadStatus] = useState('');

    let arr = item.asset_url.split('/');

    const {fs} = RNFetchBlob;
    const downloads = `${fs.dirs.DocumentDir}/${arr[arr.length-1]}`;
    const configOptions = {
        fileCache: true,
        path: downloads,
        notification: true,
    };

    const checkFile = async ()=>{
        if(uri.indexOf('.3gp')>-1 && DeviceInfo.ios){
            await RNFetchBlob.fs.stat(downloads.replace('.3gp','.mp4')).then(file => {
                setUri(file.path);
                setDownloadStatus('downloaded');
            });
        }else {
            setDownloadStatus('downloaded');
        }
    };

    useEffect(()=>{
        checkFile();
    },[]);

    const filePress = async ()=>{
        let videoUri = uri;
        if(uri.indexOf('.3gp')>-1 && DeviceInfo.ios){
            await RNFetchBlob.fs.stat(downloads.replace('.3gp','.mp4')).then(file => {
                videoUri = file.path;
            }).catch(async ()=>{
                setDownloadStatus('downloading');
                await RNFetchBlob.config(configOptions).fetch('GET', uri).then(async (res)=>{
                    await FFmpegKit.executeAsync(`-i ${res.data} -c:v  mpeg4 ${res.data.replace('.3gp','.mp4')}`).then(() => {
                        setTimeout(()=>{
                            videoUri = res.data.replace('.3gp','.mp4');
                            setDownloadStatus('downloaded');
                            RNFetchBlob.fs.unlink(res.data);
                            setUri(videoUri);
                        },1000)
                    });
                }).catch((err) => {
                    console.log(err);
                    setDownloadStatus('');
                    setUri(videoUri);
                })
            });
            return
        }
        openModal({...item,asset_url: uri})
    };

    const convertTime = (duration)=>{
        let time = (Math.floor(duration / 1000));
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        return `${minutes<10?`0${minutes}`:minutes}:${seconds<10?`0${seconds}`:seconds}`
    };

    return (
        <TouchableOpacity onPress={filePress}>
            {item.type === 'file' && !item.asset_url?null:(item.type === 'file' || item.type === 'video') && item.asset_url?
                <View style={styles.itemBackground}>
                    <View style={styles.downloadIconContainer}>
                        {downloadStatus===''?<Image style={styles.downloadIcon} source={require('../../assets/images/icons/download.png')}/>:null}
                        {downloadStatus==='downloading'?<View style={styles.downloadingIcon}>
                            <ActivityIndicator size={'small'} color={Colors.white}/>
                        </View>:null}
                    </View>
                    <Video
                        paused={true}
                        source={{uri: uri,cache: { expiresIn: 3600 }}}
                        style={styles.mediaItem}
                        resizeMode={'cover'}
                        onLoad={(data)=>{
                            setDuration(convertTime(data.duration*1000))
                        }}
                    />
                    <Text style={styles.durationText}>{duration}</Text>
                    <View style={styles.videoIconContainer}>
                        <Play width={sizes.size15} height={sizes.size15} color={Colors.white}/>
                    </View>
                </View>
                :<ImageBackground source={{uri: item.image_url}} style={styles.mediaItem}/>
            }
        </TouchableOpacity>
    )
};

const RenderList = ({ section, index, openModal }) => {
    if (index !== 0) return null;

    return (
        <FlatList
            numColumns={3}
            data={section.data}
            renderItem={({item})=>{
                return (
                    <RenderListItem section={section} index={index} openModal={openModal} item={item}/>
                )
            }}
            keyExtractor={(item,index) => index.toString()}
        />
    )
};

const AttachmentsMenu = (props)=>{
    const [state, setState] = useState({
        selectedTab: 'Media',
        modalVisible: false,
        modalFile: null
    });
    const {route} = props;
    const channel = useContext(AppContext).channel;

    const selectTab = (type)=>{
        setState({
            ...state,
            selectedTab: type
        })
    };

    const hideModal = ()=>{
        setState({
            ...state,
            modalVisible: false,
            modalFile: null
        })
    };

    const openModal = (item)=>{
        let file = {
            camera: true,
            name: new Date().getTime(),
            size: null,
            type: item.type === 'file' || item.type === 'video'?'video':item.type,
            uri: item.type === 'file' || item.type === 'video'?item.asset_url:item.image_url
        };

        setState({
            ...state,
            modalFile: file,
            modalVisible: true
        })
    };

    const _renderListLinks = ({ section, index }) => {
        if (index !== 0) return null;
        return (
            <FlatList
                data={section.data}
                renderItem={({item})=>{
                    return (
                        <TouchableOpacity onPress={()=>{Linking.openURL(item.og_scrape_url)}} style={styles.linkItem}>
                            <ImageBackground source={{uri: item.image_url}} style={styles.linkImage}/>
                            <View style={styles.linkDescContainer}>
                                <Text style={styles.linkText}>{item.text}</Text>
                                <Text style={styles.link}>{item.og_scrape_url}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item,index) => index.toString()}
            />
        )
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={DeviceInfo.ios ? "padding" : "height"}
        >
            <View style={styles.headerContainer}>
                <TabScreenHeader
                    leftIcon={'back'}
                    leftIconPress={()=>{
                        props.navigation.goBack()
                    }}
                    title={channel.data.phoneNumbers.length<3?'Media, Links and more':'Media and Links'}
                />
            </View>
            <View style={styles.tabsContainer}>
                <TouchableOpacity style={[styles.tabButton,state.selectedTab==='Media'?styles.activeTab:null]} onPress={()=>{selectTab('Media')}}>
                    <Text style={styles.tabText}>Media</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton,state.selectedTab==='Links'?styles.activeTab:null]} onPress={()=>{selectTab('Links')}}>
                    <Text style={styles.tabText}>Links</Text>
                </TouchableOpacity>
                {channel.data.phoneNumbers.length<3?<TouchableOpacity style={[styles.tabButton,state.selectedTab==='Calls'?styles.activeTab:null]} onPress={()=>{selectTab('Calls')}}>
                    <Text style={styles.tabText}>Calls</Text>
                </TouchableOpacity>:null}
                {channel.data.phoneNumbers.length<3?<TouchableOpacity style={[styles.tabButton,state.selectedTab==='Voicemails'?styles.activeTab:null]} onPress={()=>{selectTab('Voicemails')}}>
                    <Text style={styles.tabText}>Voicemails</Text>
                </TouchableOpacity>:null}
            </View>
            {state.selectedTab==='Media'?<SectionList
                stickySectionHeadersEnabled={false}
                numColumns={3}
                sections={route.params.Media}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({section,index})=>{
                    return (
                        <RenderList index={index} openModal={openModal} section={section}/>
                    )
                }}
                renderSectionHeader={({ section: { date } }) => (
                    <Text style={styles.sectionTitleText}>{date}</Text>
                )}
                ListEmptyComponent={<View style={styles.emptyListContainer}>
                    <Image style={styles.voicemailsEmptyImgStyle} source={require('../../assets/images/no-media.png')}/>
                    <Text style={styles.emptyListText}>No photos or videos</Text>
                </View>}
            />:null}
            {state.selectedTab==='Links'?<SectionList
                stickySectionHeadersEnabled={false}
                numColumns={3}
                sections={route.params.Links}
                keyExtractor={(item, index) => index.toString()}
                renderItem={_renderListLinks}
                renderSectionHeader={({ section: { date } }) => (
                    <Text style={styles.sectionTitleText}>{date}</Text>
                )}
                ListEmptyComponent={<View style={styles.emptyListContainer}>
                    <Image style={styles.voicemailsEmptyImgStyle} source={require('../../assets/images/no-liks.png')}/>
                    <Text style={styles.emptyListText}>No links</Text>
                </View>}
            />:null}
            {state.selectedTab==='Calls'?<History
                navigation={props.navigation}
                mediaUi={true}
                filterNumber={route.params?.number}
            />:null}
            {state.selectedTab==='Voicemails'?<History
                navigation={props.navigation}
                mediaUi={true}
                filterNumber={route.params?.number}
                tabSelected={2}
            />:null}
            <Modal
                isOpen={state.modalVisible}
            >
                {state.modalFile?<Preview
                    file={state.modalFile}
                    hideModal={hideModal}
                    onlyShow={true}
                />:null}
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default AttachmentsMenu
