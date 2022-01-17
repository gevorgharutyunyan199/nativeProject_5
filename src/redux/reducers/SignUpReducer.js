import {
    SET_SIGN_UP_AREA_CODES_LIST_DATA,
    SET_SELECTED_AREA_CODE,
    SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA,
    SET_PRODUCTS,
    SET_PENDING_TYPE
} from '../../actionsTypes';

const INITIAL_STATE = {
    areaCodes: [],
    selectedAreaCode: '',
    phoneNumbers: [],
    type: 0,
    products: []
};

export default (state = INITIAL_STATE,action)=>{
    switch (action.type) {
        case SET_SIGN_UP_AREA_CODES_LIST_DATA:
            return {
                ...state,
                areaCodes: action.payload
            };
        case SET_PENDING_TYPE:
            return {
                ...state,
                type: action.payload
            };
        case SET_SELECTED_AREA_CODE:
            return {
                ...state,
                selectedAreaCode: action.payload
            };
        case SET_SIGN_UP_PHONE_NUMBERS_LIST_DATA:
            return {
                ...state,
                phoneNumbers: action.payload
            };
        case SET_PRODUCTS:
            return {
                ...state,
                products: action.payload
            };
        default: return state
    }
}
