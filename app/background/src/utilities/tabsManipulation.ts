import { Action, ActionResultActionTypeEnum, ActionResultEnum,
    actionResultsStrings, AppActionTypeEnum, ContentScriptMessageTypeEnum, PageStateEnum, Tab, TabsActionTypeEnum } from 'common';
import { store } from '..';

export const onRemoved = (tabID: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    const subscribedTabID: number = store.getState().appReducer.isShutdownEventScheduled;
    if (subscribedTabID === tabID) {
        store.dispatch({
            type: AppActionTypeEnum.RemoveScheduledShutdown,
        });
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
    if (changeInfo['status'] && changeInfo['status'] === 'loading') {
        store.dispatch({
            type: TabsActionTypeEnum.SetTabState,
            data: {
                state: PageStateEnum.WaitingForFirstLoad,
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
};
