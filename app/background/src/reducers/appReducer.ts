import { Action, AppActionTypeEnum } from 'common';
import { ApplicationModeEnum, AppReducerState } from 'common/storeModels';

const initialAppMode = (process.env.IS_BASE !== undefined ? JSON.parse(process.env.IS_BASE) : false) ?
        ApplicationModeEnum.Timer : ApplicationModeEnum.VideoPlayer;
const initialTime = '00:00:00';
const initialDateTime = new Date(new Date().toDateString() + ', ' + initialTime);

export const appReducerInitialState: AppReducerState = {
    selectedApplicationMode: initialAppMode,
    isHostAppActive: false,
    isShutdownEventScheduled: 0,
    shutdownEvent: undefined,
    inputSelectedDateTime: initialDateTime,
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
                isShutdownEventScheduled:  state.selectedApplicationMode === ApplicationModeEnum.VideoPlayer ?
                    (action._sender?.tab.id ? action._sender.tab.id : 0) : -1,
            };
        }
        case AppActionTypeEnum.RemoveScheduledShutdown: {
            return {
                ...appReducerInitialState,
                selectedApplicationMode: state.selectedApplicationMode,
                isHostAppActive: state.isHostAppActive,
            };
        }
        case AppActionTypeEnum.ChangeApplicationState: {
            const newState = action.data;
            return {
                ...state,
                selectedApplicationMode: newState,
                inputSelectedDateTime: initialDateTime,
                inputSelectedTime: initialTime,
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
                inputSelectedDateTime: action.data,
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
