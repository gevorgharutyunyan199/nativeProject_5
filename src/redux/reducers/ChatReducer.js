import {
    SET_ACTIVE_CHAT_LIST_DATA,
    SET_ACTIVE_CHAT_ID,
    SET_SHOW_CHANNELS_LIST
} from '../../actionsTypes';

const INITIAL_STATE = {
    listData: [],
    activeChatId: '',
    showChannelsList: true
};

export default (state = INITIAL_STATE,action)=>{
    switch (action.type) {
        case SET_ACTIVE_CHAT_LIST_DATA:
            return {
                ...state,
                listData: action.payload
            };
        case SET_ACTIVE_CHAT_ID:
            return {
                ...state,
                activeChatId: action.payload
            };
        case SET_SHOW_CHANNELS_LIST:
            return {
                ...state,
                showChannelsList: action.payload
            };
        default: return state
    }
}
