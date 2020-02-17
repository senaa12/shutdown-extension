import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import rootReducer, { rootReducerInitialState } from './reducers/rootReducer';

import { wrapStore } from 'webext-redux';
import messageHandler from './messageHandler';
import { connecToNativeApp } from './utilities/nativeCommunication';
import { onActivated, onRemoved, onUpdated } from './utilities/tabsManipulation';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

export const store = createStore(
    rootReducer,
    rootReducerInitialState,
    !isProduction ? applyMiddleware(logger) : undefined,
);

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);
chrome.tabs.onActivated.addListener(onActivated);

chrome.runtime.onMessage.addListener(messageHandler);

connecToNativeApp();
