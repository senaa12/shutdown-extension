import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import rootReducer, { rootReducerInitialState } from './reducers/rootReducer';

import { wrapStore } from 'webext-redux';
import messageHandler from './messageHandler';
import { connecToNativeApp } from './utilities/nativeCommunication';
import { onRemoved, onUpdated } from './utilities/tabsManipulation';

export const store = createStore(rootReducer, rootReducerInitialState, applyMiddleware(logger));

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);

chrome.runtime.onMessage.addListener(messageHandler);

connecToNativeApp();
