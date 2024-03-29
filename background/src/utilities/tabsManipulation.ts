import {
    Action,
    ActionResultActionTypeEnum,
    ActionResultEnum,
    actionResultsStrings,
    AppActionTypeEnum,
    ContentScriptMessageTypeEnum,
    isPopupOpenWrapper,
    isShutdownScheduledSelector,
    Tab,
    TabsActionTypeEnum,
    TabStateEnum} from 'common';
import { store } from '..';
import { changeIcon } from './actions';

export const onRemoved = (tabID: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    const subscribedTabID: number = store.getState().appReducer.shutdownEventScheduleData;
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
        store.dispatch({
            type: TabsActionTypeEnum.ClearAndSetWaitingForFirstLoad
        } as Action);
        changeIcon();
    }
};

export const onUpdated = (tabId: number, changeInfo: chrome.tabs.UpdateProperties, tab: Tab) => {
    const isShutdownScheduled = isShutdownScheduledSelector(store.getState());
    if (!isShutdownScheduled) {
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

export const onHistoryStateUpdated = (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    const isShutdownScheduled = isShutdownScheduledSelector(store.getState());
    const isPopupOpen = isPopupOpenWrapper();

    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/transitionQualifier
    if (isPopupOpen && !isShutdownScheduled && details.transitionQualifiers.includes('forward_back')) {
        store.dispatch({
            type: TabsActionTypeEnum.ClearAndSetWaitingForFirstLoad,
            _sender: {
                tab: {
                    id: details.tabId,
                },
            },
        } as Action);
    }
};
