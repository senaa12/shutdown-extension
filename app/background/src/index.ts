import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import rootReducer, { rootReducerInitialState } from './reducers/rootReducer';

import {wrapStore} from 'webext-redux';

const store = createStore(rootReducer, rootReducerInitialState, applyMiddleware(logger));

export default wrapStore(store);
