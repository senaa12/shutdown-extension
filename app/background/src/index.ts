import { wrapStore } from 'webext-redux';
import messageHandler from './messageHandler';
import createStore from './reducers/store';
import { checkSystem } from './utilities/actions';
import { connecToNativeApp } from './utilities/nativeCommunication';
import { onHistoryStateUpdated, onRemoved, onUpdated } from './utilities/tabsManipulation';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

export const store = createStore(isProduction);

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);

// browser back button
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);

chrome.runtime.onMessage.addListener(messageHandler);

connecToNativeApp();

checkSystem();
