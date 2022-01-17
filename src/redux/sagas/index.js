import {takeLatest, all, takeEvery, put} from 'redux-saga/effects';
import {
    GET_AREA_CODES_LIST_DATA,
    CHECK_AREA_CODE,
    GET_PHONE_NUMBERS_LIST_DATA,
    SEND_VERIFICATION_SMS,
    SIGN_UP,
    SIGN_IN,
    CHECK_SMS_TOKEN,
    RESET_PASSWORD,
    GET_CURRENT_USER,
    ORDER_PHONE_NUMBERS,
    SAVE_LAST_ACTION,
    SET_LAST_CALL_COUNT,
    SIGN_OUT,
    REFRESH_SIGNALR_TOKEN,
    REFRESH_TOKEN,
    CHECK_PHONE_NUMBER,
    CREATE_CONTACT,
    GET_CONTACTS,
    GET_SUGGESTIONS_CONTACTS,
    GET_CONTACT_BY_ID,
    UPDATE_CONTACT,
    DELETE_CONTACT,
    ADD_FILE,
    CHANGE_PASSWORD,
    GET_BLOCKED_CONTACTS,
    GET_BROADSOFT_STATUSES,
    CHANGE_BROADSOFT_STATUSES,
    GET_CALL_HISTORY,
    GET_VOICEMAILS,
    GENERATE_OUTGOING_CALL_NUMBER,
    GET_VOICEMAIL_BY_ID,
    MARK_VOICEMAIL,
    DELETE_VOICEMAIL,
    BLOCK_NUMBER,
    UNBLOCK_NUMBER,
    GET_PRIVATE_CHAT,
    SEND_PRIVATE_MESSAGE,
    GET_CHATS,
    DELETE_CHAT_HISTORY,
    CHANGE_LAST_SEEN_TIME,
    GET_MESSAGES,
    DELETE_MESSAGE,
    GET_BADGES,
    ADD_VOICEMAIL_GREETING,
    GET_VOICEMAIL_GREETINGS,
    ENABLE_VOICEMAIL_GREETING,
    DELETE_VOICEMAIL_GREETING,
    UPDATE_VOICEMAIL_GREETING,
    GET_AUDIO_FILE_BY_NAME,
    REFRESH_CHANNELS_LIST,
    DELETE_ACCOUNT,
    CHANGE_REGISTERED_NUMBER,
    CHECK_SMS_TOKEN_CHANGE_NUMBER,
    SET_FCM_TOKEN, UPDATE_UNSEEN_CHATS_COUNT, SET_SEEN_CALLS_REQ
} from '../../actionsTypes'

import {
    getAreaCodesListData,
    getPhoneNumbersLIstData,
    checkAreaCode,
    sendVerificationSMS,
    signUp,
    signIn,
    checkSmsToken,
    resetPassword,
    orderPhoneNumbers,
    signOut,
    checkPhoneNumber,
    checkSmsTokenChangeNumber
} from './rootSagas/signUpActions';

import {
    getCurrentUser,
    refreshToken,
    addFile,
    changePassword,
    getBroadsoftStatuses,
    changeBroadsoftStatuses,
    getBadges,
    addVoicemailGreeting,
    getVoicemailGreetings,
    enableVoicemailGreeting,
    deleteVoicemailGreeting,
    updateVoicemailGreeting,
    refreshSignalRToken,
    getAudioFileByName,
    deleteAccount,
    changeRegisteredNumber,
    setFCM
} from './rootSagas/userActions';

import {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
    getBlockedContacts,
    blockNumber,
    unblockNumber,
    getSuggestionsContacts
} from './rootSagas/contactActions';

import {
    getCallHistory,
    generateOutgoingCallNumber, setSeenCalls
} from './rootSagas/callActions';

import {
    getVoicemails,
    getVoicemailById,
    markVoicemail,
    deleteVoicemail
} from './rootSagas/voicemailActions';

import {
    getPrivateChat,
    sendPrivateMessage,
    getChats,
    deleteChatHistory,
    changeLastSeenTime,
    getMessages,
    deleteMessage,
    refreshChannelsList,
    updateUnseenChatsCount
} from './rootSagas/chatActions';

function* actionWatcher() {
    yield takeEvery('*', function* logger(action) {
        if(action.type !== SAVE_LAST_ACTION && action.type !== SET_LAST_CALL_COUNT && action.type !== SIGN_OUT && action.type !== REFRESH_TOKEN && action.type !== REFRESH_SIGNALR_TOKEN){
            yield put({type: SAVE_LAST_ACTION, payload: action});
        }
    });
    yield takeLatest(GET_AREA_CODES_LIST_DATA, getAreaCodesListData);
    yield takeLatest(CHECK_AREA_CODE, checkAreaCode);
    yield takeLatest(GET_PHONE_NUMBERS_LIST_DATA, getPhoneNumbersLIstData);
    yield takeLatest(SEND_VERIFICATION_SMS, sendVerificationSMS);
    yield takeLatest(SIGN_UP, signUp);
    yield takeLatest(SIGN_IN, signIn);
    yield takeLatest(SIGN_OUT, signOut);
    yield takeLatest(CHECK_SMS_TOKEN, checkSmsToken);
    yield takeLatest(CHECK_SMS_TOKEN_CHANGE_NUMBER, checkSmsTokenChangeNumber);
    yield takeLatest(RESET_PASSWORD, resetPassword);
    yield takeLatest(GET_CURRENT_USER, getCurrentUser);
    yield takeLatest(ORDER_PHONE_NUMBERS, orderPhoneNumbers);
    yield takeLatest(REFRESH_TOKEN, refreshToken);
    yield takeLatest(CHECK_PHONE_NUMBER, checkPhoneNumber);
    yield takeLatest(CREATE_CONTACT, createContact);
    yield takeLatest(GET_SUGGESTIONS_CONTACTS, getSuggestionsContacts);
    yield takeLatest(GET_CONTACTS, getContacts);
    yield takeLatest(GET_CONTACT_BY_ID, getContactById);
    yield takeLatest(UPDATE_CONTACT, updateContact);
    yield takeLatest(DELETE_CONTACT, deleteContact);
    yield takeLatest(ADD_FILE, addFile);
    yield takeLatest(CHANGE_PASSWORD, changePassword);
    yield takeLatest(GET_BLOCKED_CONTACTS, getBlockedContacts);
    yield takeLatest(GET_BROADSOFT_STATUSES, getBroadsoftStatuses);
    yield takeLatest(CHANGE_BROADSOFT_STATUSES, changeBroadsoftStatuses);
    yield takeLatest(GET_CALL_HISTORY, getCallHistory);
    yield takeLatest(GET_VOICEMAILS, getVoicemails);
    yield takeLatest(GENERATE_OUTGOING_CALL_NUMBER, generateOutgoingCallNumber);
    yield takeLatest(GET_VOICEMAIL_BY_ID, getVoicemailById);
    yield takeLatest(MARK_VOICEMAIL, markVoicemail);
    yield takeLatest(DELETE_VOICEMAIL, deleteVoicemail);
    yield takeLatest(BLOCK_NUMBER, blockNumber);
    yield takeLatest(UNBLOCK_NUMBER, unblockNumber);
    yield takeLatest(GET_PRIVATE_CHAT, getPrivateChat);
    yield takeEvery(SEND_PRIVATE_MESSAGE, sendPrivateMessage);
    yield takeLatest(GET_CHATS, getChats);
    yield takeLatest(DELETE_CHAT_HISTORY, deleteChatHistory);
    yield takeLatest(CHANGE_LAST_SEEN_TIME, changeLastSeenTime);
    yield takeLatest(GET_MESSAGES, getMessages);
    yield takeLatest(DELETE_MESSAGE, deleteMessage);
    yield takeLatest(GET_BADGES, getBadges);
    yield takeLatest(ADD_VOICEMAIL_GREETING, addVoicemailGreeting);
    yield takeLatest(GET_VOICEMAIL_GREETINGS, getVoicemailGreetings);
    yield takeLatest(ENABLE_VOICEMAIL_GREETING, enableVoicemailGreeting);
    yield takeLatest(DELETE_VOICEMAIL_GREETING, deleteVoicemailGreeting);
    yield takeLatest(UPDATE_VOICEMAIL_GREETING, updateVoicemailGreeting);
    yield takeLatest(REFRESH_SIGNALR_TOKEN, refreshSignalRToken);
    yield takeLatest(GET_AUDIO_FILE_BY_NAME, getAudioFileByName);
    yield takeLatest(REFRESH_CHANNELS_LIST, refreshChannelsList);
    yield takeLatest(DELETE_ACCOUNT, deleteAccount);
    yield takeLatest(CHANGE_REGISTERED_NUMBER, changeRegisteredNumber);
    yield takeLatest(SET_FCM_TOKEN, setFCM);
    yield takeLatest(UPDATE_UNSEEN_CHATS_COUNT, updateUnseenChatsCount);
    yield takeLatest(SET_SEEN_CALLS_REQ, setSeenCalls);
}

export default function* rootSaga() {
    yield all([
        actionWatcher()
    ]);
}
