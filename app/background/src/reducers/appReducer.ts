import { Action, ActionTypeEnum } from 'common';
import { ActionResultEnum, ApplicationModeEnum, AppReducerState } from 'common/storeModels';

export const appReducerInitialState: AppReducerState = {
    isEventSubscibed: false,
    tabId: 0,
    selectedApplicationMode: ApplicationModeEnum.VideoPlayer,
    selectedTime: '00:00:00',
    event: undefined,
    actionResultTooltip: ActionResultEnum.None,
    actionResultTooltipMessage: '',
    isHostAppActive: false,
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
        case ActionTypeEnum.TriggerTooltip: {
            return {
                ...state,
                actionResultTooltip: action.data.type,
                actionResultTooltipMessage: action.data?.message ?? state.actionResultTooltipMessage,
            };
        }
        case ActionTypeEnum.IsHostActiveCheck: {
            return {
                ...state,
                isHostAppActive: action.data,
            };
        }
        default:
            return state;
    }
};
