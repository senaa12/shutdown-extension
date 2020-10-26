import { wrapStore } from 'webext-redux';
import messageHandler from './messageHandler';
import createStore, { getMiddleware } from './reducers/store';
import { changeIcon, checkSystem } from './utilities/actions';
import { connecToNativeApp } from './utilities/nativeCommunication';
import { onHistoryStateUpdated, onRemoved, onUpdated } from './utilities/tabsManipulation';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

const middleWare = getMiddleware(isProduction);
export const store = createStore({}, middleWare);

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);

// browser back button
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);

chrome.runtime.onMessage.addListener(messageHandler);

connecToNativeApp();

checkSystem();

changeIcon();
