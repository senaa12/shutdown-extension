import { Action, OpenTabsReducerState, TabsActionTypeEnum, TabState } from 'common';

export const openTabsReducerInitialState: OpenTabsReducerState = {};

export default (state = openTabsReducerInitialState, action: Action): OpenTabsReducerState => {
    switch (action.type) {
        case TabsActionTypeEnum.CheckTabVideoAvailability: {
            const data: TabState = action.data;
            const sender: number = action._sender?.tab.id  ? action._sender.tab.id : -1;
            return {
                ...state,
                [sender]: { ...data },
            };
        }
        case TabsActionTypeEnum.SetWaitingForFirstLoad: {
            const loadState = {
                ...state[action.data.tabID],
                waitingForFirstLoad: action.data.waitingToFirstLoad,
            } as TabState;

            return {
                ...state,
                [action.data.tabID]: { ...loadState },
            };
        }
        case TabsActionTypeEnum.RemoveTab: {
            // tslint:disable-next-line: prefer-const
            let newState = { ...state };
            delete newState[action.data.tab];
            return {
                ...newState,
            };
        }
        default: {
            return state;
        }
    }
};
