import {
    SAVE_LAST_ACTION,
    SET_LAST_CALL_COUNT,
    SET_SCROLL_REF
} from '../../actionsTypes';

const INITIAL_STATE = {
    lastAction: {},
    lastCallCount: 0,
    scrollRef: null
};

export default (state = INITIAL_STATE,action)=>{
    switch (action.type) {
        case SAVE_LAST_ACTION:
            return {
                ...state,
                lastAction: action.payload
            };
        case SET_LAST_CALL_COUNT:
            return {
                ...state,
                lastCallCount: action.payload
            };
        case SET_SCROLL_REF:
            return {
                ...state,
                scrollRef: action.payload
            };
        default: return state
    }
}
