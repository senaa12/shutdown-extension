import { logger } from 'common';
import { wrapStore } from 'webext-redux';
import messageHandler from './messageHandler';
import createStore, { getMiddleware } from './reducers/store';
import { changeIcon, checkSystem } from './utilities/actions';
import { fetchIframeAdsSources } from './utilities/iframeAds';
import { loadInitialSportLeaguesToCollect } from './utilities/loadInitialSportLeagues';
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

chrome.runtime.onMessage.addListener(logger(messageHandler, isProduction));

loadInitialSportLeaguesToCollect();

fetchIframeAdsSources();

connecToNativeApp();

checkSystem();

changeIcon();
