import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList, Image, ImageBackground, AppState, ActivityIndicator} from 'react-native';
import ImageResizer from "react-native-image-resizer";
import styles from './styles';
import CameraRoll from "@react-native-community/cameraroll";
import {TabScreenHeader, Preview} from "../../components";
import {sizes} from "../../assets/sizes";
import {Colors, iconsColors} from "../../assets/RootStyles";
import {ArrowRight, Info} from "../../assets/icons";
import Modal from 'react-native-modalbox';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';


class Gallery extends Component{

    state = {
        recentPhotos: [],
        albums: [],
        screenType: 'Recents',
        albumImages: [],
        errorText: '',
        modalVisible: false,
        selectedItem: null,
        onlyPhoto: true,
        loadingMore: false,
        first: 40,
        path3gp: null
    };

    async componentDidMount() {
        const {route} = this.props;
        if(route.params){
            this.setState({
                onlyPhoto: route.params.onlyPhoto
            })
        }
        this.intervalCheck = setInterval(async ()=>{
            await this.loadRecentPhotos();
        },2000);
        AppState.addEventListener('change',this._stateChange);
        await this.loadAlbums();
        await this.loadRecentPhotos();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change',this._stateChange);
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }
    }

    _stateChange = async (state)=>{
        if(state === 'active'){
            await this.loadAlbums();
            await this.loadRecentPhotos();
        }
    };

    loadRecentPhotos = async ()=>{
        const {onlyPhoto} = this.state;

        await CameraRoll.getPhotos({
            first: this.state.first,
            assetType: onlyPhoto?'Photos':'All',
            include: [
                'fileSize',
                'playableDuration'
            ]
        }).then((res) => {
            let albomArr = [...this.state.albums];
            if(this.state.albums[0] && this.state.albums[0].title === "Recents"){
                albomArr[0] = {title: "Recents", count: 0, img: res.edges[0]};
                this.setState({
                    recentPhotos: res.edges,
                    albums: albomArr
                })
            }else {
                let album = {title: "Recents", count: res.edges.length, img: res.edges[0]};
                this.setState({
                    recentPhotos: res.edges,
                    albums: [album,...this.state.albums]
                })
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    loadAlbums = async ()=>{
        const {onlyPhoto} = this.state;

        await CameraRoll.getAlbums({
            assetType: onlyPhoto?'Photos':'All'
        }).then(async (res) => {
            for(let i = 0; i< res.length; i++){
                res[i].img = await this.getAlbumFirstImage(res[i]);
            }
            await this.setState({
                albums: res
            })
        }).catch((error) => {
            console.log(error);
        });
    };

    showAlbums = ()=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }

        this.setState({
            screenType: 'Albums',
            first: 40,
            loadingMore: false
        })
    };

    getAlbumFirstImage = async (item)=>{
        const {onlyPhoto} = this.state;

        return await CameraRoll.getPhotos({
            groupTypes: 'Album',
            assetType: onlyPhoto?'Photos':'All',
            first: 1,
            groupName: item.title,
            include: [
                'fileSize',
                'playableDuration'
            ]
        }).then((res) => {
            return res.edges[res.edges.length-1]
        }).catch((error) => {
            console.log(error);
        });
    };

    loadAlbumImages = (item)=>{
        const {onlyPhoto} = this.state;

        CameraRoll.getPhotos({
            groupTypes: 'Album',
            assetType: onlyPhoto?'Photos':'All',
            first: this.state.first,
            groupName: item.title,
            include: [
                'fileSize',
                'playableDuration'
            ]
        }).then((res) => {
            this.setState({
                albumImages: res.edges
            })
        }).catch((error) => {
            console.log(error);
        });
    };

    convertDuration = (duration)=>{
        let time = (Math.floor(duration / 1000));
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        return `${minutes<10?`0${minutes}`:minutes}:${seconds<10?`0${seconds}`:seconds}`
    };

    albumPress = (item)=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }

        this.setState({
            screenType: item.title,
            albumImages: []
        },()=>{
            this.loadAlbumImages(item);
        })
    };

    itemSelect = async (item)=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }

        if(item.node.type.indexOf('image')>-1){
            let resizeFile = await ImageResizer.createResizedImage(
                item.node.image.uri,
                500,
                500,
                'JPEG',
                100,
                0,
                undefined,
                false,
                {
                    mode: 'contain',
                    onlyScaleDown: true
                });

            item.node.image.fileSize = resizeFile.size;
        }


        let sizeInMB = (item.node.image.fileSize / (1024*1024)).toFixed(2);
        if(item.node.type.indexOf('video')>-1 && sizeInMB>50){
            this.showError('That video is too big. Please choose another.');
            return true
        }else if(item.node.type.indexOf('image')>-1 && sizeInMB>2){
            this.showError('That image is too big. Please choose another.');
            return true
        }

        if(this.timerError){
            clearTimeout(this.timerError)
        }

        const {route} = this.props;
        const shouldConvert  = item.node.type.includes('video') && route.params && route.params.isExistNotLinexUser

        this.setState({
            modalVisible: true,
            errorText: '',
            selectedItem: {
                type: item.node.type,
                uri: item.node.image.uri,
                name: item.node.image.filename,
                size: item.node.image.fileSize,
                duration: item.node.image.playableDuration,
                extension: item.node.extension,
                converted: !shouldConvert
            }
        });
        if(shouldConvert) {
            let regex = /:\/\/(.{36})\//i;
            let result = item.node.image.uri.match(regex);
            let nameArr = item.node.image.name?item.node.image.name.split('.'):['','mov'];
            let fileName = nameArr[nameArr.length-1];
            let videoUri = `assets-library://asset/asset.${fileName}?id=${result[1]}&ext=${fileName}`;

            RNFS.copyAssetsVideoIOS(videoUri, RNFS.TemporaryDirectoryPath + `new_file.${fileName}`).then((path)=>{
                FFmpegKit.executeAsync(`-y -i ${path} -r 20 -s 352x288 -vb 400k -acodec aac -strict experimental -ac 1 -ar 8000 -ab 24k ${path.replace('.mov', '_copy.3gp')}`, async (session) => {
                    const returnCode = await session.getReturnCode();
                    if (ReturnCode.isSuccess(returnCode)) {
                        this.setState({
                            path3gp: path.replace('.mov', '_copy.3gp'),
                            selectedItem : {...this.state.selectedItem, converted: true}
                        });
                        RNFS.unlink(path).then(() => {
                            console.log('Copied file deleted');
                        }).catch((err) => {
                            console.log('Copied file delete error', err.message);
                        })
                    } else if (ReturnCode.isCancel(returnCode)) {
                        console.log(returnCode)
                    }
                });
            })
        }
    };

    hideModal = ()=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }

        this.setState({
            modalVisible: false
        })
    };

    showError = (text)=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }

        this.setState({
            errorText: text
        },()=>{
            if(this.timerError){
                clearTimeout(this.timerError)
            }
            this.timerError = setTimeout(()=>{
                this.setState({
                    errorText: ''
                });
                clearTimeout(this.timerError)
            },3000)
        })
    };

    send = (data)=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }

        const {route} = this.props;
        if(route.params && route.params.send){
            route.params.send({
                type: data.type,
                path3gp: this.state.path3gp,
                uri: data.uri,
                extension: data.extension,
                name: `${new Date().getTime()}`,
                size: null,
                camera: true
            });
            this.setState({path3gp: null})
            this.props.navigation.goBack();
            this.hideModal();
        }
    };

    renderAlbums = (item)=>{
        return (
           item.img?<TouchableOpacity style={[styles.albumsItem,styles.rowContainer]} onPress={()=>{
                this.albumPress(item)
            }}>
                <View style={styles.rowContainer}>
                    <Image
                        style={styles.imageStyle}
                        resizeMode={'cover'}
                        source={{uri: item.img.node.image.uri}}
                    />
                    <View style={styles.albumInfoContainer}>
                        <Text style={styles.albumInfoTitleText}>{item.title}</Text>
                        {item.count?<Text style={styles.count}>{item.count}</Text>:null}
                    </View>
                    <View style={styles.arrowIconContainer}>
                        <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                    </View>
                </View>
            </TouchableOpacity>:null
        )
    };

    renderImageItem = (item)=>{
        return (
            <TouchableOpacity onPress={()=>{
                this.itemSelect(item)
            }}>
                <ImageBackground source={{uri: item.node.image.uri}} style={styles.imageBackground}>
                      {item.node.type.indexOf('video')>-1?<Text style={styles.videoDuration}>{this.convertDuration(Math.round(item.node.image.playableDuration)*1000)}</Text>:null}
                </ImageBackground>
            </TouchableOpacity>
        )
    };

    loadMoreRecent = async (e)=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }
        if(!this.state.loadingMore && this.state.recentPhotos.length % 40 === 0){
            if(e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height-0.1){
                this.setState({
                    loadingMore: true
                },()=>{
                    setTimeout(async ()=>{
                        const {onlyPhoto} = this.state;

                        await CameraRoll.getPhotos({
                            first: this.state.first + 40,
                            assetType: onlyPhoto?'Photos':'All',
                            include: [
                                'fileSize',
                                'playableDuration'
                            ]
                        }).then((res) => {
                            this.setState({
                                recentPhotos: res.edges,
                                loadingMore: false,
                                first: this.state.first + 40
                            })
                        }).catch((error) => {
                            console.log(error);
                        });
                    },500)
                })
            }
        }
    };

    loadMoreAlbumImages = async (e)=>{
        if(this.intervalCheck){
            clearInterval(this.intervalCheck)
        }
        if(!this.state.loadingMore && this.state.albumImages.length % 40 === 0){
            if(e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height-0.1){
                this.setState({
                    loadingMore: true
                },()=>{
                    setTimeout(async ()=>{
                        const {onlyPhoto} = this.state;

                        await CameraRoll.getPhotos({
                            groupTypes: 'Album',
                            assetType: onlyPhoto?'Photos':'All',
                            first: this.state.first + 40,
                            groupName: this.state.screenType,
                            include: [
                                'fileSize',
                                'playableDuration'
                            ]
                        }).then((res) => {
                            this.setState({
                                albumImages: res.edges,
                                loadingMore: false,
                                first: this.state.first + 40
                            })
                        }).catch((error) => {
                            console.log(error);
                        });
                    },500)
                })
            }
        }
    };

    render() {
        const {
            screenType,
            albums,
            recentPhotos,
            albumImages,
            errorText,
            modalVisible,
            selectedItem,
            loadingMore
        } = this.state;

        const {navigation,route} = this.props;

        return(
            <View style={styles.screen}>
                <View style={styles.headerContainer}>
                    {screenType !== 'Albums'?<TabScreenHeader
                        title={screenType}
                        leftIcon={'albums'}
                        leftIconPress={this.showAlbums}
                        rightIcon={'cancel'}
                        rightIconPress={navigation.goBack}
                    />:<TabScreenHeader
                        title={screenType}
                        rightIcon={'cancel'}
                        rightIconPress={navigation.goBack}
                    />}
                </View>
                {errorText?<View style={styles.errorContainer}>
                    <Info width={sizes.size32} height={sizes.size32} color={Colors.white} />
                    <Text style={styles.errorText}>{errorText}</Text>
                </View>:null}
                {screenType === 'Albums'?<FlatList
                    data={albums}
                    renderItem={({item})=>{
                        return this.renderAlbums(item)
                    }}
                    keyExtractor={(item,index) => index.toString()}
                />:null}
                {screenType === 'Recents'?<FlatList
                    numColumns={4}
                    data={recentPhotos}
                    renderItem={({item})=>{
                        return this.renderImageItem(item)
                    }}
                    keyExtractor={(item,index) => index.toString()}
                    onScroll={async ({nativeEvent}) => {await this.loadMoreRecent({nativeEvent})}}
                    ListFooterComponent={loadingMore && <View style={styles.listFooter}>
                        <ActivityIndicator size={'small'} color={Colors.activeBullet}/>
                    </View>}
                />:null}
                {screenType !== 'Recents' && screenType !== 'Albums'?<FlatList
                    numColumns={4}
                    data={albumImages}
                    renderItem={({item})=>{
                        return this.renderImageItem(item)
                    }}
                    keyExtractor={(item,index) => index.toString()}
                    onScroll={async ({nativeEvent}) => {await this.loadMoreAlbumImages({nativeEvent})}}
                    ListFooterComponent={loadingMore && <View style={styles.listFooter}>
                        <ActivityIndicator size={'small'} color={Colors.activeBullet}/>
                    </View>}
                />:null}
                <Modal
                    isOpen={modalVisible}
                >
                    <Preview
                        file={selectedItem}
                        hideModal={this.hideModal}
                        send={this.send}
                        contactImageSelect={route.params?route.params.contactImageSelect:false}
                    />
                </Modal>
            </View>
        )
    }
}

export default Gallery;
