import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import rootReducer, { rootReducerInitialState } from './reducers/rootReducer';

import { ActionTypeEnum, ContentScriptMessageTypeEnum, Tab } from 'common';
import { wrapStore } from 'webext-redux';

const store = createStore(rootReducer, rootReducerInitialState, applyMiddleware(logger));

export default wrapStore(store);

chrome.tabs.onUpdated.addListener((tabID: number, changeInfo: chrome.tabs.UpdateProperties, tab: Tab) => {
    // tslint:disable-next-line: no-string-literal
    if (changeInfo.url || (changeInfo['status'] && changeInfo['status'] === 'complete')) {
        chrome.tabs.query({ url: tab.url }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id ? tabs[0].id : 0, {
                type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
            });
        });
    }
});

chrome.tabs.onRemoved.addListener((tabID: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    console.log('removed');
    const subscribedTabID: number = store.getState().appReducer.tabId;
    if (subscribedTabID === tabID) {
        store.dispatch({ type: ActionTypeEnum.RemoveVideoEndSubscription });
    }

    store.dispatch({
        type: ActionTypeEnum.RemoveTab,
        data: {
            tab: tabID,
        },
    });
});
