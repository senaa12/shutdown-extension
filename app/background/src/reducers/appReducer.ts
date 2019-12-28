import { Action, ActionTypeEnum } from 'common';
import { ApplicationModeEnum, AppReducerState } from 'common/storeModels';

export const appReducerInitialState: AppReducerState = {
    isEventSubscibed: false,
    tabId: 0,
    selectedApplicationMode: ApplicationModeEnum.VideoPlayer,
    selectedTime: '00:00:00',
    event: undefined,
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
                event: action.data.event,
                tabId:  action._sender?.tab.id ? action._sender.tab.id : -1,
            };
        }
        case ActionTypeEnum.RemoveVideoEndSubscription: {
            return {
                selectedApplicationMode: state.selectedApplicationMode,
                ...appReducerInitialState,
            };
        }
        case ActionTypeEnum.ChangeApplicationState: {
            const newState = action.data;
            return {
                ...state,
                selectedApplicationMode: newState,
                selectedTime: '00:00:00',
            };
        }
        case ActionTypeEnum.ChangeSelectedTime: {
            return {
                ...state,
                selectedTime: action.data,
            };
        }
        default:
            return state;
    }
};
