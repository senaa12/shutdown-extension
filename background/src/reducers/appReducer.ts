import { Action, AppActionTypeEnum, initialDateTime, initialTime, PlatformEnum } from 'common';
import { ApplicationModeEnum, AppReducerState } from 'common/storeModels';

const initialAppMode = ApplicationModeEnum.VideoPlayer;

export const appReducerInitialState: AppReducerState = {
    selectedApplicationMode: initialAppMode,
    isHostAppActive: false,
    platformType: PlatformEnum.win,
    shutdownEventScheduleData: 0,
    shutdownEvent: undefined,
    inputSelectedDateTimeString: initialDateTime(),
    inputSelectedTime: initialTime,
};

export default (state = appReducerInitialState, action: Action): AppReducerState => {
    switch (action.type) {
        case AppActionTypeEnum.ScheduleShutdown: {
            if (!action.data?.success) {
                return state;
            }

            return {
                ...state,
                shutdownEvent: action.data.event,
                shutdownEventScheduleData:  state.selectedApplicationMode === ApplicationModeEnum.VideoPlayer ?
                    (action._sender?.tab.id ? action._sender.tab.id : 0) : -1,
            };
        }
        case AppActionTypeEnum.RemoveScheduledShutdown: {
            return {
                ...appReducerInitialState,
                inputSelectedTime: state.selectedApplicationMode !== ApplicationModeEnum.Timer ?
                    state.inputSelectedTime : initialTime,
                selectedApplicationMode: state.selectedApplicationMode,
                isHostAppActive: state.isHostAppActive,
            };
        }
        case AppActionTypeEnum.ChangeApplicationState: {
            const newState = action.data.newState;
            const newInputTime = action.data.newInputValue;
            return {
                ...state,
                selectedApplicationMode: newState,
                inputSelectedDateTimeString: initialDateTime(),
                inputSelectedTime: newInputTime,
            };
        }
        case AppActionTypeEnum.ChangeSelectedTime: {
            return {
                ...state,
                inputSelectedTime: action.data,
            };
        }
        case AppActionTypeEnum.ChangeSelectedDateTime: {
            return {
                ...state,
                inputSelectedDateTimeString: action.data,
            };
        }
        case AppActionTypeEnum.IsHostActiveCheck: {
            return {
                ...state,
                isHostAppActive: action.data,
            };
        }
        case AppActionTypeEnum.SetPlatformType: {
            return {
                ...state,
                platformType: action.data,
            };
        }
        default:
            return state;
    }
};
