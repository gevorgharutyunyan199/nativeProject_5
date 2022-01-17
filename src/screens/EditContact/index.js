import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ActionSheetIOS,
    Linking,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Modal
} from 'react-native';
import styles from './styles';
import {ScreenLoader, TabScreenHeader} from '../../components';
import {connect} from "react-redux";
import {makeAction} from "../../makeAction";
import {ChangeImage, Add, ArrowRight, Cancel, Minus} from '../../assets/icons';
import {sizes} from "../../assets/sizes";
import {DeviceInfo} from "../../assets/DeviceInfo";
import {Colors, iconsColors} from "../../assets/RootStyles";
import FastImage from 'react-native-fast-image';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import {SwipeListView} from 'react-native-swipe-list-view';
import LinearGradient from "react-native-linear-gradient";
import {
    CREATE_CONTACT,
    UPDATE_CONTACT,
    DELETE_CONTACT,
    ADD_FILE
} from '../../actionsTypes';
import ContactsService from "../../services/ContactsService";
console.reportErrorsAsExceptions = false;

class EditContact extends Component {

    state = {
        loaderVisible: false,
        newPhoto: null,
        contact: {},
        changed: true,
        menuVisible: false,
        scrollPosition: {
            last: 0,
            size: 1
        },
        selectedTextTone: {
            label: 'Default',
            code: '1001'
        },
        mobileLabelRowWidth: 0,
        phoneNumbers: [],
        emailLabelRowWidth: 0,
        emails: [],
        urlLabelRowWidth: 0,
        urls: [],
        addressLabelRowWidth: 0,
        addresses: [],
        recordId: null,
    };

    componentDidMount() {
        const {route} = this.props;
        if (route.params && route.params.contact) {
            this.setState({
                changed: false,
                contact: {
                    firstName: route.params.contact.givenName,
                    lastName: route.params.contact.familyName,
                    company: route.params.contact.company,
                    notes: route.params.contact.notes,
                    id: route.params.contact.id,
                    imageUri: route.params.contact.imageUri,
                },
                recordId: route.params.contact.recordId,
                phoneNumbers: [...route.params.contact.phoneNumbers],
                emails: [...route.params.contact.emailAddresses],
                addresses: [...route.params.contact.postalAddresses],
                urls: [...route.params.contact.urlAddresses],
                selectedTextTone: route.params.contact.textTone?{...route.params.contact.textTone}:{
                    label: 'Default',
                    code: '1001'
                }
            })
        } else if (route.params && route.params.unknownNumber) {
            this.setState({
                phoneNumbers: [{
                    label: 'home',
                    number: route.params.unknownNumber.phoneNumber !== 'Unavailable'?route.params.unknownNumber.phoneNumber:''
                }],
                changed: true
            })
        }
    }

    openActionSheet = () => {
        const {newPhoto, contact} = this.state;
        if (DeviceInfo.ios) {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: newPhoto || contact.imageUri ? ["Cancel", "Take Photo", "Choose Existing Photo", "Remove Photo"] : ["Cancel", "Take Photo", "Choose Existing Photo"],
                    destructiveButtonIndex: 3,
                    cancelButtonIndex: 0,
                    tintColor: Colors.appColor1
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 1:
                            this.takePhoto();
                            return;
                        case 2:
                            this.chooseExistingPhoto();
                            return;
                        case 3:
                            this.removePhoto();
                            return
                    }
                }
            );
        } else {
            this.openMenu()
        }
    };

    setNewPhoto = (photo) => {
        this.setState({
            newPhoto: photo,
            changed: true
        })
    };

    takePhoto = async () => {
        await request(DeviceInfo.ios ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
        await check(DeviceInfo.ios ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((res) => {
            if (res === 'blocked' || res === 'denied') {
                Alert.alert(
                    "Camera Unavailable",
                    "LineX does not have access to your \ncamera. To enable access, go to \nSettings and turn on Camera.",
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Settings', onPress: () => Linking.openURL('app-settings://')}
                    ]
                );
            } else {
                this.props.navigation.navigate('CameraPage', {
                    onlyPhoto: true,
                    send: this.setNewPhoto,
                    contactImageSelect: true
                });
            }
        });
    };

    chooseExistingPhoto = async () => {
        await request(DeviceInfo.ios ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        await check(DeviceInfo.ios ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((res) => {
            if (res === 'blocked' || res === 'denied') {
                Alert.alert(
                    "Photo Library Unavailable",
                    "LineX does not have access to your \nphotos. To enable access, go to \nSettings and allow photos access.",
                    [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Settings', onPress: () => Linking.openURL('app-settings://')}
                    ]
                );
            } else {
                this.props.navigation.navigate('Gallery', {
                    onlyPhoto: true,
                    send: this.setNewPhoto,
                    contactImageSelect: true
                });
            }
        });
    };

    removePhoto = () => {
        const {newPhoto, contact} = this.state;
        if (newPhoto) {
            this.setState({
                newPhoto: null,
                changed: true
            });
            return
        }
        if (contact.imageUri) {
            this.handleChange('imageUri', '');
        }
    };

    deleteContact = () => {
        const {makeAction, route, navigation} = this.props;
        const {contact,recordId} = this.state;
        Alert.alert(
            "Are you sure you want to \ndelete this contact?",
            "",
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                    }
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        this.setState({
                            loaderVisible: true
                        });
                        makeAction(DELETE_CONTACT, {
                            callback: () => {
                                try {
                                    this.setState({
                                        loaderVisible: false
                                    });
                                    navigation.navigate(route.params.rootScreen);
                                } catch (e) {
                                    console.log(e)
                                }
                            },
                            error: () => {
                                this.setState({
                                    loaderVisible: false
                                })
                            },
                            contact: {
                                ...contact,
                                recordId:recordId
                            }
                        });
                    }
                }
            ]
        );
    };

    handleChange = (key, value) => {
        this.setState({
            contact: {
                ...this.state.contact,
                [key]: value
            },
            changed: true
        })
    };

    updateContact = () => {
        const {makeAction, route, navigation} = this.props;
        const {contact, phoneNumbers, emails, addresses, urls, selectedTextTone, recordId} = this.state;

        let arrNumbers = phoneNumbers.filter(item => item.number);
        let arrEmails = emails.filter(item => item.email);
        let arrUrls = urls.filter(item => item.url);

        makeAction(UPDATE_CONTACT, {
            callback: () => {
                try {
                    this.setState({
                        loaderVisible: false
                    });
                    if (route.params && route.params.loadContactInfo) {
                        route.params.loadContactInfo();
                    }
                    navigation.goBack();
                } catch (e) {
                    console.log(e)
                }
            },
            error: () => {
                this.setState({
                    loaderVisible: false
                })
            },
            contact: {
                id: contact.id,
                recordId: recordId,
                jobTitle: null,
                givenName: contact.firstName,
                middleName: null,
                familyName: contact.lastName,
                company: contact.company,
                phoneNumbers: ContactsService.clearSymbols(JSON.parse(JSON.stringify(arrNumbers))),
                imageUri: contact.imageUri,
                notes: contact.notes,
                emailAddresses: arrEmails,
                imAddresses: [],
                postalAddresses: addresses,
                birthday: null,
                urlAddresses: arrUrls,
                textTone: selectedTextTone
            }
        });
    };

    createContact = () => {
        const {makeAction, route, navigation} = this.props;
        const {contact, phoneNumbers, emails, addresses, urls, selectedTextTone, recordId} = this.state;

        let arrNumbers = phoneNumbers.filter(item => item.number);
        let arrEmails = emails.filter(item => item.email);
        let arrUrls = urls.filter(item => item.url);

        makeAction(CREATE_CONTACT, {
            callback: (data) => {
                try {
                    this.setState({
                        loaderVisible: false
                    });
                    navigation.replace('ContactDetails', {
                        number: data.phoneNumber,
                        id: data.id,
                        getContacts: route.params.getContacts,
                        rootScreen: route.params.rootScreen
                    })
                } catch (e) {
                    console.log(e)
                }
            },
            error: () => {
                this.setState({
                    loaderVisible: false
                })
            },
            contact: {
                recordId: recordId,
                jobTitle: null,
                givenName: contact.firstName,
                middleName: null,
                familyName: contact.lastName,
                company: contact.company,
                phoneNumbers: ContactsService.clearSymbols(JSON.parse(JSON.stringify(arrNumbers))),
                imageUri: contact.imageUri,
                notes: contact.notes,
                emailAddresses: arrEmails,
                imAddresses: [],
                postalAddresses: addresses,
                birthday: null,
                urlAddresses: arrUrls,
                textTone: selectedTextTone
            }
        });
    };

    addFile = (cb) => {
        const {makeAction} = this.props;
        const {newPhoto} = this.state;
        makeAction(ADD_FILE, {
            callback: (data) => {
                this.setState({
                    contact: {
                        ...this.state.contact,
                        imageUri: data.uri
                    },
                    changed: true
                }, () => {
                    cb();
                });
            },
            error: () => {
                this.setState({
                    loaderVisible: false
                })
            },
            file: newPhoto,
            type: 'contacts'
        })
    };

    save = () => {
        const {route} = this.props;
        const {newPhoto} = this.state;
        this.setState({
            loaderVisible: true
        });
        if (route.params && route.params.contact) {
            if (newPhoto) {
                this.addFile(this.updateContact);
            } else {
                this.updateContact()
            }
        } else {
            if (newPhoto) {
                this.addFile(this.createContact);
            } else {
                this.createContact()
            }
        }
    };

    openMenu = () => {
        this.setState({
            menuVisible: true
        })
    }

    closeMenu = () => {
        this.setState({
            menuVisible: false
        })
    }

    onScrollView = ({nativeEvent}) => {
        if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height) {
            return
        }
        if (nativeEvent.contentOffset.y > 0 && this.state.scrollPosition.size > 0.5 && nativeEvent.contentOffset.y > this.state.scrollPosition.last) {
            this.setState({
                scrollPosition: {
                    last: nativeEvent.contentOffset.y,
                    size: nativeEvent.contentOffset.y > sizes.size75 ? 0.5 : this.state.scrollPosition.size - 0.1
                }
            })
        } else if (this.state.scrollPosition.size < 1 && nativeEvent.contentOffset.y <= this.state.scrollPosition.last) {
            this.setState({
                scrollPosition: {
                    last: nativeEvent.contentOffset.y,
                    size: this.state.scrollPosition.size + 0.1
                }
            })
        }
    };

    addPhone = () => {
        const {phoneNumbers} = this.state;
        const {contactLabels} = this.props;

        let label = 'mobile';

        for(let i = 0; i < contactLabels.phoneLabels.length; i++){
            if(phoneNumbers.findIndex(elem=>elem.label===contactLabels.phoneLabels[i])===-1){
                label =  contactLabels.phoneLabels[i];
                break
            }
        }

        phoneNumbers.push({
            label: label,
            number: ''
        });

        this.setState({
            phoneNumbers: phoneNumbers,
            changed: true
        },()=>{
            this[`phoneInput${this.state.phoneNumbers.length-1}`].focus();
        })
    };

    addEmail = () => {
        const {emails} = this.state;
        const {contactLabels} = this.props;

        let label = 'home';

        for(let i = 0; i < contactLabels.emailLabels.length; i++){
            if(emails.findIndex(elem=>elem.label===contactLabels.emailLabels[i])===-1){
                label =  contactLabels.emailLabels[i];
                break
            }
        }

        emails.push({
            label: label,
            email: ''
        });

        this.setState({
            emails: emails,
            changed: true
        },()=>{
            this[`emailInput${this.state.emails.length-1}`].focus();
        })
    };

    addUrl = () => {
        const {urls} = this.state;
        const {contactLabels} = this.props;

        let label = 'homepage';

        for(let i = 0; i < contactLabels.urlLabels.length; i++){
            if(urls.findIndex(elem=>elem.label===contactLabels.urlLabels[i])===-1){
                label =  contactLabels.urlLabels[i];
                break
            }
        }

        urls.push({
            label: label,
            url: ''
        });

        this.setState({
            urls: urls,
            changed: true
        },()=>{
            this[`urlInput${this.state.urls.length-1}`].focus();
        })
    };

    addAddress = () => {
        const {addresses} = this.state;
        const {contactLabels} = this.props;

        let label = 'home';

        for(let i = 0; i < contactLabels.addressLabels.length; i++){
            if(addresses.findIndex(elem=>elem.label===contactLabels.addressLabels[i])===-1){
                label =  contactLabels.addressLabels[i];
                break
            }
        }

        addresses.push({
            label: label,
            street: '',
            address: '',
            region: '',
            postCode: '',
            country: 'United States'
        });

        this.setState({
            addresses: addresses,
            changed: true
        })
    };

    changeLabel = (type,index,label)=>{
        if(type === 'selectedTextTone'){
            this.setState({
                selectedTextTone: {
                    label: label,
                    code: ''
                },
                changed: true
            })
        }else if(type === 'country'){
            this.state.addresses[index].country = label;
            this.setState({
                addresses: this.state.addresses,
                changed: true
            })
        }else {
            let arr = this.state[type];
            arr[index].label = label;
            this.setState({
                [type]: arr,
                changed: true
            })
        }
    };

    validate = ()=>{
        let disabled = true;
        const {contact, phoneNumbers, emails, addresses, urls} = this.state;

        if(contact.firstName || contact.lastName || contact.imageUri || contact.notes){
            disabled = false;
        }

        phoneNumbers.forEach(i=>{
            if(i.number){
                disabled = false;
            }
        });

        emails.forEach(i=>{
            if(i.email){
                disabled = false;
            }
        });

        addresses.forEach(i=>{
            if(i.street || i.address || i.region || i.postCode){
                disabled = false;
            }
        });

        urls.forEach(i=>{
            if(i.url){
                disabled = false;
            }
        });

        return disabled
    };

    render() {
        const {navigation, route} = this.props;
        const {
            contact,
            newPhoto,
            loaderVisible,
            changed,
            menuVisible,
            selectedTextTone,
            phoneNumbers,
            mobileLabelRowWidth,
            emails,
            emailLabelRowWidth,
            urls,
            urlLabelRowWidth,
            addressLabelRowWidth,
            addresses
        } = this.state;

        return (
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={DeviceInfo.ios?"padding":"height"}
            >
                {loaderVisible?<ScreenLoader/>:null}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={menuVisible}
                >
                    <TouchableWithoutFeedback onPress={this.closeMenu}>
                        <View style={[styles.androidMenu]}>
                            <View style={styles.bottomSheetContainer}>
                                <View style={styles.bottomSheetHeader}>
                                    <View style={styles.lineContainer}>
                                        <View style={styles.line}/>
                                    </View>
                                    <Text style={styles.bottomSheetTitle}>Change profile picture</Text>
                                </View>
                                <View style={styles.bottomSheetContent}>
                                    <TouchableOpacity style={styles.button} onPress={() => {
                                        this.closeMenu();
                                        this.takePhoto();
                                    }}>
                                        <Text style={styles.buttonText}>Take photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => {
                                        this.closeMenu();
                                        this.chooseExistingPhoto();
                                    }}>
                                        <Text style={styles.buttonText}>Choose existing photo</Text>
                                    </TouchableOpacity>
                                    {newPhoto || contact.imageUri ?
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            this.closeMenu();
                                            this.removePhoto();
                                        }}>
                                            <Text style={[styles.buttonText, {color: Colors.wrong}]}>Remove photo</Text>
                                        </TouchableOpacity> : null}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <View style={styles.screen}>
                    <View style={styles.headerContainer}>
                        <TabScreenHeader
                            leftIcon={DeviceInfo.ios ? 'cancel' : 'back'}
                            leftIconPress={() => {
                                navigation.goBack()
                            }}
                            title={route.params && route.params.contact ? 'Edit Contact' : 'Create Contact'}
                            rightIcon={'save'}
                            rightIconPress={this.save}
                            rightIconColor={!changed || this.validate()? iconsColors.arrow : ''}
                            rightDisabled={!changed || this.validate()}
                        />
                    </View>
                    <View style={styles.imageContainer}>
                        <TouchableWithoutFeedback onPress={this.openActionSheet}>
                            <View style={styles.imageContentContainer}>
                                {newPhoto?<Image
                                    style={[styles.userPhoto, {
                                        borderWidth: sizes.size3 * this.state.scrollPosition.size,
                                        width: sizes.size110 * this.state.scrollPosition.size,
                                        height: sizes.size110 * this.state.scrollPosition.size
                                    }]}
                                    resizeMode={'cover'}
                                    source={{uri: newPhoto.uri}}
                                />:contact.imageUri?<FastImage
                                    onError={()=>{
                                        this.setState({
                                            contact: {
                                                ...this.state.contact,
                                                imageUri: ''
                                            }
                                        })
                                    }}
                                    style={[styles.userPhoto, {
                                        borderWidth: sizes.size3 * this.state.scrollPosition.size,
                                        width: sizes.size110 * this.state.scrollPosition.size,
                                        height: sizes.size110 * this.state.scrollPosition.size
                                    }]}
                                    resizeMode={FastImage.resizeMode.cover}
                                    source={{uri: contact.imageUri}}
                                />:<View style={[styles.userPhoto, styles.defaultUserImageContainer, {
                                    borderWidth: sizes.size3 * this.state.scrollPosition.size,
                                    width: sizes.size110 * this.state.scrollPosition.size,
                                    height: sizes.size110 * this.state.scrollPosition.size
                                }]}>
                                    <FastImage
                                        style={[styles.defaultUserImage, {
                                            width: sizes.size41 * this.state.scrollPosition.size,
                                            height: sizes.size45 * this.state.scrollPosition.size
                                        }]}
                                        resizeMode={FastImage.resizeMode.cover}
                                        source={require('../../assets/images/defaultUserImage.png')}
                                    />
                                </View>}
                                <TouchableOpacity style={styles.editPhotoButton} onPress={this.openActionSheet}>
                                    <ChangeImage width={sizes.size43 * this.state.scrollPosition.size}
                                                 height={sizes.size43 * this.state.scrollPosition.size}/>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        ref={ref => this.scrollContainer = ref}
                        nestedScrollEnabled={true}
                        scrollEventThrottle={16}
                        onScroll={this.onScrollView}
                        onContentSizeChange={(x,y) => {
                            this.setState({
                                contentHeight: y
                            })
                        }}
                    >
                        <View style={[styles.inputBloch, styles.inputBorderBottom]}>
                            <TextInput
                                style={styles.inputStyle}
                                blurOnSubmit={true}
                                onChangeText={(text) => this.handleChange('firstName', text)}
                                value={contact.firstName}
                                placeholder={'First name'}
                                placeholderTextColor={Colors.placeholderTextColor}
                            />
                        </View>
                        <View style={[styles.inputBloch, styles.inputBorderBottom]}>
                            <TextInput
                                style={styles.inputStyle}
                                blurOnSubmit={true}
                                onChangeText={(text) => this.handleChange('lastName', text)}
                                value={contact.lastName}
                                placeholder={'Last name'}
                                placeholderTextColor={Colors.placeholderTextColor}
                            />
                        </View>
                        <View style={[styles.inputBloch, styles.inputBorderBottom, styles.blockMarginBottom]}>
                            <TextInput
                                style={styles.inputStyle}
                                blurOnSubmit={true}
                                onChangeText={(text) => this.handleChange('company', text)}
                                value={contact.company}
                                placeholder={'Company'}
                                placeholderTextColor={Colors.placeholderTextColor}
                            />
                        </View>
                        <SwipeListView
                            keyboardShouldPersistTaps="handled"
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            data={phoneNumbers}
                            disableLeftSwipe={true}
                            renderItem={({item, index}, rowMap) => (
                                <View style={styles.phoneNumberItemContainer}>
                                    <TouchableOpacity onPress={() => {
                                        rowMap[index].manuallySwipeRow(-sizes.size85)
                                    }}>
                                        <Minus width={sizes.size23} height={sizes.size23}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.labelButton,mobileLabelRowWidth?{width: mobileLabelRowWidth}:null]}
                                        onPress={() => {
                                            this.props.navigation.navigate('ContactLabel', {
                                                index: index,
                                                type: 'phoneNumbers',
                                                changeLabel: this.changeLabel,
                                                selected: item.label
                                            });
                                        }}>
                                        <Text
                                            onLayout={(event) => {
                                                if(event.nativeEvent.layout.width+sizes.size50>mobileLabelRowWidth){
                                                    this.setState({
                                                        mobileLabelRowWidth: event.nativeEvent.layout.width+sizes.size50
                                                    })
                                                }
                                            }}
                                            style={styles.labelText}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                        >
                                            {item.label}
                                        </Text>
                                        <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                                    </TouchableOpacity>
                                    <LinearGradient style={styles.gradientLine} start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={[Colors.grayBorder, Colors.white]}/>
                                    <View style={[styles.inputBloch, styles.inputBlochPadding, {flex: 1}]}>
                                        <TextInput
                                            ref={(input)=>{this[`phoneInput${index}`] = input}}
                                            keyboardType={'phone-pad'}
                                            style={styles.inputStyle}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                phoneNumbers[index].number = text;
                                                this.setState({
                                                    phoneNumbers: phoneNumbers,
                                                    changed: true
                                                });
                                            }}
                                            value={phoneNumbers[index].number}
                                            placeholder={'Phone'}
                                            placeholderTextColor={Colors.placeholderTextColor}
                                            onFocus={()=>{
                                                this.scrollContainer.scrollTo({ x: 0, y: sizes.size100+index*sizes.size50, animated: true });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                            renderHiddenItem={({item, index}, rowMap) => (
                                <View style={styles.hiddenItemContainer}>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                        phoneNumbers.splice(index, 1);
                                        rowMap[index].closeRow();
                                        this.setState({
                                            phoneNumbers: phoneNumbers,
                                            changed: true
                                        })
                                    }}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            closeOnRowPress={true}
                            rightOpenValue={-sizes.size85}
                            disableRightSwipe={true}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={this.addPhone}>
                            <Add width={sizes.size32} height={sizes.size32}/>
                            <Text style={styles.addButtonText}>add phone</Text>
                        </TouchableOpacity>
                        <SwipeListView
                            keyboardShouldPersistTaps="handled"
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            data={emails}
                            disableLeftSwipe={true}
                            renderItem={({item, index}, rowMap) => (
                                <View style={styles.phoneNumberItemContainer}>
                                    <TouchableOpacity onPress={() => {
                                        rowMap[index].manuallySwipeRow(-sizes.size85)
                                    }}>
                                        <Minus width={sizes.size23} height={sizes.size23}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.labelButton,emailLabelRowWidth?{width: emailLabelRowWidth}:null]}
                                        onPress={() => {
                                            this.props.navigation.navigate('ContactLabel', {
                                                index: index,
                                                type: 'emails',
                                                changeLabel: this.changeLabel,
                                                selected: item.label
                                            });
                                        }}>
                                        <Text
                                            onLayout={(event) => {
                                                if(event.nativeEvent.layout.width+sizes.size50>emailLabelRowWidth){
                                                    this.setState({
                                                        emailLabelRowWidth: event.nativeEvent.layout.width+sizes.size50
                                                    })
                                                }
                                            }}
                                            style={styles.labelText}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                        >
                                            {item.label}
                                        </Text>
                                        <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                                    </TouchableOpacity>
                                    <LinearGradient style={styles.gradientLine} start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={[Colors.grayBorder, Colors.white]}/>
                                    <View style={[styles.inputBloch, styles.inputBlochPadding, {flex: 1}]}>
                                        <TextInput
                                            ref={(input)=>{this[`emailInput${index}`] = input}}
                                            keyboardType={'email-address'}
                                            style={styles.inputStyle}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                emails[index].email = text;
                                                this.setState({
                                                    emails: emails,
                                                    changed: true
                                                });
                                            }}
                                            value={emails[index].email}
                                            placeholder={'Email'}
                                            placeholderTextColor={Colors.placeholderTextColor}
                                            onFocus={()=>{
                                                this.scrollContainer.scrollTo({ x: 0, y: phoneNumbers.length*sizes.size50+sizes.size170+index*sizes.size50, animated: true });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                            renderHiddenItem={({item, index}, rowMap) => (
                                <View style={styles.hiddenItemContainer}>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                        emails.splice(index, 1);
                                        rowMap[index].closeRow();
                                        this.setState({
                                            emails: emails,
                                            changed: true
                                        })
                                    }}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            closeOnRowPress={true}
                            rightOpenValue={-sizes.size85}
                            disableRightSwipe={true}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={this.addEmail}>
                            <Add width={sizes.size32} height={sizes.size32}/>
                            <Text style={styles.addButtonText}>add email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.addButton, {justifyContent: 'space-between'}]} onPress={()=>{
                            this.props.navigation.navigate('ContactLabel', {
                                index: 0,
                                type: 'selectedTextTone',
                                changeLabel: this.changeLabel,
                                selected: selectedTextTone.label
                            });
                        }}>
                            <View style={styles.rowContainer}>
                                <Text style={[styles.addButtonText, {marginLeft: sizes.size3}]}>Text Tone</Text>
                                <Text style={[styles.addButtonText, styles.selectedTone]}>{selectedTextTone.label}</Text>
                            </View>
                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                        </TouchableOpacity>
                        <SwipeListView
                            keyboardShouldPersistTaps="handled"
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            data={urls}
                            disableLeftSwipe={true}
                            renderItem={({item, index}, rowMap) => (
                                <View style={styles.phoneNumberItemContainer}>
                                    <TouchableOpacity onPress={() => {
                                        rowMap[index].manuallySwipeRow(-sizes.size85)
                                    }}>
                                        <Minus width={sizes.size23} height={sizes.size23}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.labelButton,urlLabelRowWidth?{width: urlLabelRowWidth}:null]}
                                        onPress={() => {
                                            this.props.navigation.navigate('ContactLabel', {
                                                index: index,
                                                type: 'urls',
                                                changeLabel: this.changeLabel,
                                                selected: item.label
                                            });
                                        }}>
                                        <Text
                                            onLayout={(event) => {
                                                if(event.nativeEvent.layout.width+sizes.size50>urlLabelRowWidth){
                                                    this.setState({
                                                        urlLabelRowWidth: event.nativeEvent.layout.width+sizes.size50
                                                    })
                                                }
                                            }}
                                            style={styles.labelText}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                        >
                                            {item.label}
                                        </Text>
                                        <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                                    </TouchableOpacity>
                                    <LinearGradient style={styles.gradientLine} start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={[Colors.grayBorder, Colors.white]}/>
                                    <View style={[styles.inputBloch, styles.inputBlochPadding, {flex: 1}]}>
                                        <TextInput
                                            ref={(input)=>{this[`urlInput${index}`] = input}}
                                            style={styles.inputStyle}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                urls[index].url = text;
                                                this.setState({
                                                    urls: urls,
                                                    changed: true
                                                });
                                            }}
                                            value={urls[index].url}
                                            placeholder={'Url'}
                                            placeholderTextColor={Colors.placeholderTextColor}
                                            onFocus={()=>{
                                                this.scrollContainer.scrollTo({ x: 0, y: emails.length*sizes.size50+phoneNumbers.length*sizes.size50+sizes.size350+index*sizes.size50, animated: true });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                            renderHiddenItem={({item, index}, rowMap) => (
                                <View style={styles.hiddenItemContainer}>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => {
                                        urls.splice(index, 1);
                                        rowMap[index].closeRow();
                                        this.setState({
                                            urls: urls,
                                            changed: true
                                        })
                                    }}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            closeOnRowPress={true}
                            rightOpenValue={-sizes.size85}
                            disableRightSwipe={true}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={this.addUrl}>
                            <Add width={sizes.size32} height={sizes.size32}/>
                            <Text style={styles.addButtonText}>add url</Text>
                        </TouchableOpacity>
                        <SwipeListView
                            keyboardShouldPersistTaps="handled"
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            data={addresses}
                            disableLeftSwipe={true}
                            renderItem={({item, index}, rowMap) => (
                                <View style={styles.phoneNumberItemContainer}>
                                    <TouchableOpacity onPress={() => {
                                        rowMap[index].manuallySwipeRow(-sizes.size85)
                                    }}>
                                        <Minus width={sizes.size23} height={sizes.size23}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.labelButton,urlLabelRowWidth?{width: urlLabelRowWidth}:null]}
                                        onPress={() => {
                                            this.props.navigation.navigate('ContactLabel', {
                                                index: index,
                                                type: 'addresses',
                                                changeLabel: this.changeLabel,
                                                selected: item.label
                                            });
                                        }}>
                                        <Text
                                            onLayout={(event) => {
                                                if(event.nativeEvent.layout.width+sizes.size50>addressLabelRowWidth){
                                                    this.setState({
                                                        addressLabelRowWidth: event.nativeEvent.layout.width+sizes.size50
                                                    })
                                                }
                                            }}
                                            style={styles.labelText}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                        >
                                            {item.label}
                                        </Text>
                                        <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                                    </TouchableOpacity>
                                    <LinearGradient style={styles.gradientLine} start={{x: 0, y: 1}} end={{x: 1, y: 0}} colors={[Colors.grayBorder, Colors.white]}/>
                                    <View style={[styles.addressInputBloch, styles.inputBlochPadding, {flex: 1}]}>
                                        <TextInput
                                            style={[styles.inputStyle,styles.addressInput]}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                addresses[index].street = text;
                                                this.setState({
                                                    addresses: addresses,
                                                    changed: true
                                                });
                                            }}
                                            value={addresses[index].street}
                                            placeholder={'Street'}
                                            placeholderTextColor={Colors.placeholderTextColor}
                                        />
                                        <TextInput
                                            style={[styles.inputStyle,styles.addressInput]}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                addresses[index].address = text;
                                                this.setState({
                                                    addresses: addresses,
                                                    changed: true
                                                });
                                            }}
                                            value={addresses[index].address}
                                            placeholder={'City'}
                                            placeholderTextColor={Colors.placeholderTextColor}
                                        />
                                        <TextInput
                                            style={[styles.inputStyle,styles.addressInput]}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                addresses[index].region = text;
                                                this.setState({
                                                    addresses: addresses,
                                                    changed: true
                                                });
                                            }}
                                            value={addresses[index].region}
                                            placeholder={'State'}
                                            placeholderTextColor={Colors.placeholderTextColor}
                                        />
                                        <TextInput
                                            style={[styles.inputStyle,styles.addressInput]}
                                            blurOnSubmit={true}
                                            onChangeText={(text) => {
                                                addresses[index].postCode = text;
                                                this.setState({
                                                    addresses: addresses,
                                                    changed: true
                                                });
                                            }}
                                            value={addresses[index].postCode}
                                            placeholder={'Zip Code'}
                                            placeholderTextColor={Colors.placeholderTextColor}
                                        />
                                        <TouchableOpacity style={styles.countryButton}  onPress={() => {
                                            this.props.navigation.navigate('ContactLabel', {
                                                index: index,
                                                type: 'country',
                                                changeLabel: this.changeLabel,
                                                selected: item.country
                                            });
                                        }}>
                                            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.countryButtonText}>{addresses[index].country}</Text>
                                            <ArrowRight width={sizes.size32} height={sizes.size32} color={iconsColors.arrow}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            renderHiddenItem={({item, index}, rowMap) => (
                                <View style={styles.hiddenItemContainer}>
                                    <TouchableOpacity style={[styles.deleteButton,{height: sizes.size290}]} onPress={() => {
                                        addresses.splice(index, 1);
                                        rowMap[index].closeRow();
                                        this.setState({
                                            addresses: addresses,
                                            changed: true
                                        })
                                    }}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            closeOnRowPress={true}
                            rightOpenValue={-sizes.size85}
                            disableRightSwipe={true}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={this.addAddress}>
                            <Add width={sizes.size32} height={sizes.size32}/>
                            <Text style={styles.addButtonText}>add address</Text>
                        </TouchableOpacity>
                        <View
                            style={[styles.blockMarginBottom, styles.notesBlock, !route.params || !route.params.contact || DeviceInfo.android ? styles.inputBorderBottom : null]}>
                            <TextInput
                                onFocus={()=>{
                                    this.scrollContainer.scrollTo({y: this.state.contentHeight-250, animated: true})
                                }}
                                style={styles.noteTextInputStyle}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(text) => this.handleChange('notes', text)}
                                value={contact.notes}
                                placeholder={'Notes'}
                                placeholderTextColor={Colors.placeholderTextColor}
                            />
                        </View>
                        {DeviceInfo.ios && route.params && route.params.contact ?
                            <TouchableOpacity style={[styles.actionButton, styles.blockMarginBottom]}
                                              onPress={this.deleteContact}>
                                <Text style={styles.actionButtonText}>Delete Contact</Text>
                            </TouchableOpacity> : null}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = store => {
    return {
        userInfo: store.UserInfoReducer,
        contactLabels: store.ContactLabelsReducer
    }
};

export default connect(mapStateToProps, {makeAction})(EditContact)
