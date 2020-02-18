import {
    Action,
    ActionResultActionTypeEnum,
    ActionResultEnum,
    actionResultsStrings,
    AppActionTypeEnum,
    ContentScriptMessageTypeEnum,
    Tab,
    TabsActionTypeEnum,
    TabStateEnum } from 'common';
import { store } from '..';

export const onRemoved = (tabID: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    const subscribedTabID: number = store.getState().appReducer.isShutdownEventScheduled;
    if (subscribedTabID === tabID) {
        store.dispatch({
            type: AppActionTypeEnum.RemoveScheduledShutdown,
        } as Action);
        store.dispatch({
            type: ActionResultActionTypeEnum.TriggerTooltip,
            data: {
                type: ActionResultEnum.Canceled,
                message: actionResultsStrings.cancel.canceledInBackground,
            },
        } as Action);
    }
};

export const onUpdated = (tabId: number, changeInfo: chrome.tabs.UpdateProperties, tab: Tab) => {
    const isPopupOpened = chrome.extension.getViews({ type: 'popup' }).length > 0;
    const isShutdownScheduled = store.getState().appReducer.isShutdownEventScheduled !== 0;
    if (isPopupOpened && !isShutdownScheduled) {
        // tslint:disable-next-line: no-string-literal
        if (changeInfo['status'] && changeInfo['status'] === 'loading') {
            store.dispatch({
                type: TabsActionTypeEnum.SetTabState,
                data: {
                    state: TabStateEnum.WaitingForFirstLoad,
                },
                _sender: {
                    tab: {
                        id: tabId,
                    },
                },
            } as Action);
        }

        // tslint:disable-next-line: no-string-literal
        if (changeInfo['status'] && changeInfo['status'] === 'complete') {
            chrome.tabs.sendMessage(tabId, {
                    type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                    data: {
                        tabID: tabId,
                    },
            });
        }
    }
};

export const onActivated = (activeInfo: chrome.tabs.TabActiveInfo) => {
    const isShutdownScheduled = store.getState().appReducer.isShutdownEventScheduled !== 0;
    if (!isShutdownScheduled) {
        store.dispatch({
            type: TabsActionTypeEnum.ClearAndSetWaitingForFirstLoad,
            _sender: {
                tab: {
                    id: activeInfo.windowId,
                },
            },
        } as Action);
    }
};
