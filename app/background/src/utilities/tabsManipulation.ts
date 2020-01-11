import { ActionResultActionTypeEnum, ActionResultEnum, actionResultsStrings,
    AppActionTypeEnum, ContentScriptMessageTypeEnum, Tab, TabsActionTypeEnum } from 'common';
import { store } from '..';

export const onRemoved = (tabID: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    console.log('removed');
    const subscribedTabID: number = store.getState().appReducer.isShutdownEventScheduled;
    if (subscribedTabID === tabID) {
        store.dispatch({ type: AppActionTypeEnum.RemoveVideoEndSubscription });
        store.dispatch({
            type: ActionResultActionTypeEnum.TriggerTooltip,
            data: {
                type: ActionResultEnum.Canceled,
                message: actionResultsStrings.cancel.canceledInBackground,
            },
        });
    }

    store.dispatch({
        type: TabsActionTypeEnum.RemoveTab,
        data: {
            tab: tabID,
        },
    });
};

export const onUpdated = (tabId: number, changeInfo: chrome.tabs.UpdateProperties, tab: Tab) => {
    // tslint:disable-next-line: no-string-literal
    if (changeInfo['status'] && changeInfo['status'] === 'complete') {
        store.dispatch({
            type: TabsActionTypeEnum.SetWaitingForFirstLoad,
            data: {
                tabID: tabId,
                waitingForFirstLoad: true,
            },
        });

        chrome.tabs.sendMessage(tabId, {
                type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                data: {
                    tabID: tabId,
                },
        });
    }
};
