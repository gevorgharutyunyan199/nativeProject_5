import {
    SET_ACTIVE_PRODUCTS,
    SET_APP_CONTACTS,
    SET_CALL_HISTORY,
    SET_BLOCKED_CONTACTS,
    SET_BLOCKED_NUMBERS,
    SET_UNREAD_MESSAGES_COUNT,
    SET_USER_INITIAL_STATE,
    SET_VOICEMAILS,
    MARK_VOICEMAIL_READED,
    SET_VOICEMAIL_CONTENT,
    DELETE_VOICEMAIL_IN_LIST,
    SET_CHATS,
    SET_IN_APP_NOTIFICATION_DATA,
    SET_UNREAD_HISTORY_COUNT,
    SET_UNREAD_VOICEMAIL_COUNT,
    SET_VOICEMAIL_GREATINGS,
    SET_HISTORY_DATA_LOAD_SCREEN,
    SET_CONTACTS_SYNCING, SET_CURRENT_USER, ADD_CALL, ADD_VOICEMAIL
} from '../../actionsTypes';

const INITIAL_STATE = {
    activeProducts: [],
    appContacts: [],
    callHistory: [],
    historyDataLoadScreen: '',
    blockedContacts: [],
    blockedNumbers: [],
    unreadMessagesCount: 0,
    unreadHistoryCount: 0,
    unreadVoicemailCount: 0,
    voicemails: [],
    chats: [],
    inAppNotificationData: {},
    voicemailGreeting: [],
    syncing: false
};

export default (state = INITIAL_STATE,action)=>{
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            };
        case SET_USER_INITIAL_STATE:
            return {
                ...INITIAL_STATE
            };
        case SET_HISTORY_DATA_LOAD_SCREEN:
            return {
                ...state,
                historyDataLoadScreen: action.payload
            };
        case SET_CONTACTS_SYNCING:
            return {
                ...state,
                syncing: action.payload
            };
        case SET_ACTIVE_PRODUCTS:
            return {
                ...state,
                activeProducts: action.payload
            };
        case SET_APP_CONTACTS:
            return {
                ...state,
                appContacts: action.payload
            };

        case SET_CALL_HISTORY:
            return {
                ...state,
                callHistory: action.payload
            };
        case ADD_CALL:
            const {callHistory} = state
            return {
                ...state,
                callHistory: [action.payload, ...callHistory]
            };
        case SET_BLOCKED_CONTACTS:
            return {
                ...state,
                blockedContacts: action.payload
            };
        case SET_BLOCKED_NUMBERS:
            return {
                ...state,
                blockedNumbers: action.payload
            };
        case SET_UNREAD_MESSAGES_COUNT:
            return {
                ...state,
                unreadMessagesCount: action.payload
            };
        case SET_UNREAD_VOICEMAIL_COUNT:
            return {
                ...state,
                unreadVoicemailCount: action.payload
            };
        case SET_UNREAD_HISTORY_COUNT:
            return {
                ...state,
                unreadHistoryCount: action.payload
            };
        case SET_VOICEMAILS:
            return {
                ...state,
                voicemails: action.payload
            };
        case ADD_VOICEMAIL:
            const {voicemails} = state
            return {
                ...state,
                voicemails: [action.payload, ...voicemails ]
            };
        case MARK_VOICEMAIL_READED:
            let voicemailsCopy = [...state.voicemails];
            voicemailsCopy[action.payload.index].read = action.payload.value;
            return {
                ...state,
                voicemails: voicemailsCopy
            };
        case SET_VOICEMAIL_CONTENT:
            let voicemailsCopyContent = [...state.voicemails];
            voicemailsCopyContent[action.payload.index].content = action.payload.value;
            return {
                ...state,
                voicemails: voicemailsCopyContent
            };
        case DELETE_VOICEMAIL_IN_LIST:
            let voicemailsDeletCopy = [...state.voicemails];
            voicemailsDeletCopy.splice(action.payload.index, 1);
            return {
                ...state,
                voicemails: voicemailsDeletCopy
            };
        case SET_CHATS:
            return {
                ...state,
                chats: action.payload
            };
        case SET_IN_APP_NOTIFICATION_DATA:
            return {
                ...state,
                inAppNotificationData: action.payload
            };
        case SET_VOICEMAIL_GREATINGS:
            return {
                ...state,
                voicemailGreeting: action.payload
            };
        default: return state
    }
}
