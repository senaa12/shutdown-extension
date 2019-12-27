import { Action, ActionTypeEnum } from 'common';
import { ApplicationModeEnum, AppReducerState } from 'common/storeModels';

export const appReducerInitialState: AppReducerState = {
    isEventSubscibed: false,
    tabId: 0,
    selectedApplicationMode: ApplicationModeEnum.VideoPlayer,
};

export default (state = appReducerInitialState, action: Action): AppReducerState => {
    switch (action.type) {
        case ActionTypeEnum.SubscribedToVideoEnd: {
            if (!action.data?.success) {
                return state;
            }

            return {
                ...state,
                isEventSubscibed: action.data.success,
                tabId:  action._sender?.tab.id ? action._sender.tab.id : -1,
            };
        }
        case ActionTypeEnum.RemoveVideoEndSubscription: {
            return appReducerInitialState;
        }
        case ActionTypeEnum.ChangeApplicationState: {
            const newState = action.data;
            return {
                ...state,
                selectedApplicationMode: newState,
            };
        }
        default:
            return state;
    }
};
