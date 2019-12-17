import { Action, ActionTypeEnum, OpenTabsReducerState, TabState } from 'common';

export const openTabsReducerInitialState: OpenTabsReducerState = {
    tabs: {},
};

export default (state = openTabsReducerInitialState, action: Action): OpenTabsReducerState => {
    switch (action.type) {
        case ActionTypeEnum.CheckTabVideoAvailability: {
            const data: TabState = action.data;
            const sender: number = action._sender?.tab.id  ? action._sender.tab.id : -1;
            const newTabs = {
                ...state.tabs,
                [sender]: { ...data },
            };
            return {
                tabs: newTabs,
            };
        }
        default: {
            return state;
        }
    }
};
