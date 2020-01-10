import { Action, AppActionTypeEnum } from 'common';
import { ApplicationModeEnum, AppReducerState } from 'common/storeModels';

export const appReducerInitialState: AppReducerState = {
    selectedApplicationMode: ApplicationModeEnum.VideoPlayer,
    isHostAppActive: false,
    isShutdownEventScheduled: 0,
    shutdownEvent: undefined,
    inputSelectedTime: '00:00:00',
};

export default (state = appReducerInitialState, action: Action): AppReducerState => {
    switch (action.type) {
        case AppActionTypeEnum.SubscribedToVideoEnd: {
            if (!action.data?.success) {
                return state;
            }

            return {
                ...state,
                shutdownEvent: action.data.event,
                isShutdownEventScheduled:  action._sender?.tab.id ? action._sender.tab.id : 0,
            };
        }
        case AppActionTypeEnum.RemoveVideoEndSubscription: {
            return {
                selectedApplicationMode: state.selectedApplicationMode,
                ...appReducerInitialState,
            };
        }
        case AppActionTypeEnum.ChangeApplicationState: {
            const newState = action.data;
            return {
                ...state,
                selectedApplicationMode: newState,
                inputSelectedTime: '00:00:00',
            };
        }
        case AppActionTypeEnum.ChangeSelectedTime: {
            return {
                ...state,
                inputSelectedTime: action.data,
            };
        }
        case AppActionTypeEnum.IsHostActiveCheck: {
            return {
                ...state,
                isHostAppActive: action.data,
            };
        }
        default:
            return state;
    }
};
