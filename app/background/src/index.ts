import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import rootReducer, { rootReducerInitialState } from './reducers/rootReducer';

import { wrapStore } from 'webext-redux';
import { onRemoved, onUpdated } from './utilities/tabsManipulation';

import messageHandler from './messageHandler';
chrome.runtime.onMessage.addListener(messageHandler);

export const store = createStore(rootReducer, rootReducerInitialState, applyMiddleware(logger));

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);
