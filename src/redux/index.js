import {combineReducers} from 'redux';
import SignUpReducer from './reducers/SignUpReducer';
import UserInfoReducer from './reducers/UserInfoReducer';
import ActionsReducer from './reducers/ActionsReducer';
import ChatReducer from './reducers/ChatReducer';
import ContactLabelsReducer from './reducers/ContactLabelsReducer';
import {createStore,applyMiddleware} from 'redux';
import rootSaga from './sagas';
import createSagaMiddleware from 'redux-saga';

let reducers = combineReducers({
    SignUpReducer: SignUpReducer,
    UserInfoReducer: UserInfoReducer,
    ActionsReducer: ActionsReducer,
    ChatReducer: ChatReducer,
    ContactLabelsReducer: ContactLabelsReducer
});

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers,applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
