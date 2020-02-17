import { Action, ActiveTabReducerState, TabsActionTypeEnum, TabStateEnum, TabState } from 'common';

export const activeTabReducerInitialState: ActiveTabReducerState = {
    tabID: 0,
    state: TabStateEnum.WaitingForFirstLoad
};

export default (state = activeTabReducerInitialState, action: Action): ActiveTabReducerState => {
    switch (action.type) {
        case TabsActionTypeEnum.SetTabState: {
            const data: TabState = action.data;
            const tabId: number = action._sender?.tab.id  ? action._sender.tab.id : -1;
            return {
                ...data,
                tabID: tabId
            };
        }
        case TabsActionTypeEnum.ClearAndSetWaitingForFirstLoad: {
            const tabId: number = action._sender?.tab.id  ? action._sender.tab.id : -1;
            return {
                ...activeTabReducerInitialState,
                tabID: tabId
            };
        }
        default: {
            return state;
        }
    }
};
