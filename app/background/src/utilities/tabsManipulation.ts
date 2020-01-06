import { ActionResultEnum, actionResultsStrings, ActionTypeEnum, ContentScriptMessageTypeEnum, Tab } from 'common';
import { store } from '..';

export const onRemoved = (tabID: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    console.log('removed');
    const subscribedTabID: number = store.getState().appReducer.tabId;
    if (subscribedTabID === tabID) {
        store.dispatch({ type: ActionTypeEnum.RemoveVideoEndSubscription });
        store.dispatch({
            type: ActionTypeEnum.TriggerTooltip,
            data: {
                type: ActionResultEnum.Canceled,
                message: actionResultsStrings.cancel.canceledInBackground,
            },
        });
    }

    store.dispatch({
        type: ActionTypeEnum.RemoveTab,
        data: {
            tab: tabID,
        },
    });
};

export const onUpdated = (tabID: number, changeInfo: chrome.tabs.UpdateProperties, tab: Tab) => {
    // tslint:disable-next-line: no-string-literal
    if (changeInfo.url || (changeInfo['status'] && changeInfo['status'] === 'complete')) {
        chrome.tabs.query({ url: tab.url }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id ? tabs[0].id : 0, {
                type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                data: {
                    tabID: tabs[0].id,
                },
            });
        });
    }
};
