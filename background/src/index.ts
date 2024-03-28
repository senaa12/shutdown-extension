import { logger } from 'common';
import { wrapStore } from '@eduardoac-skimlinks/webext-redux';
import messageHandler from './messageHandler';
import createStore, { getMiddleware } from './reducers/store';
import { changeIcon, checkSystem } from './utilities/actions';
import { fetchIframeAdsSources } from './utilities/iframeAds';
import { loadInitialSportLeaguesToCollect } from './utilities/loadInitialSportLeagues';
import { connecToNativeApp } from './utilities/nativeCommunication';
import { onConnectEventListener, onHistoryStateUpdated, onRemoved, onUpdated } from './utilities/tabsManipulation';
import { alarmHandler } from './alarms/handler';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

const middleWare = getMiddleware(isProduction);
export const store = createStore({}, middleWare);

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);

// browser back button
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);
chrome.runtime.onConnect.addListener(onConnectEventListener);

chrome.runtime.onMessage.addListener(logger(messageHandler, isProduction));

chrome.alarms.onAlarm.addListener(alarmHandler);

loadInitialSportLeaguesToCollect();

fetchIframeAdsSources();

connecToNativeApp();

checkSystem();

changeIcon();
