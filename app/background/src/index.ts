import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import { wrapStore } from 'webext-redux';
import messageHandler from './messageHandler';
import rootReducer, { rootReducerInitialState } from './reducers/rootReducer';
import { connecToNativeApp } from './utilities/nativeCommunication';
import { onHistoryStateUpdated, onRemoved, onUpdated } from './utilities/tabsManipulation';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

export const store = createStore(
    rootReducer,
    rootReducerInitialState,
    !isProduction ? applyMiddleware(logger) : undefined,
);

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);

// browser back button
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);

chrome.runtime.onMessage.addListener(messageHandler);

connecToNativeApp();
