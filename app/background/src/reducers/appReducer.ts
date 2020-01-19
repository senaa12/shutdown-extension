import { Action, AppActionTypeEnum } from 'common';
import { ApplicationModeEnum, AppReducerState } from 'common/storeModels';

const initialAppMode = (process.env.IS_BASE !== undefined ? JSON.parse(process.env.IS_BASE) : true)  ?
    ApplicationModeEnum.Countdown : ApplicationModeEnum.VideoPlayer;
const initialDate = new Date(new Date().toDateString() + ', 00:00:00');

export const appReducerInitialState: AppReducerState = {
    selectedApplicationMode: initialAppMode,
    isHostAppActive: false,
    isShutdownEventScheduled: 0,
    shutdownEvent: undefined,
    inputSelectedTime: initialDate,
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
                inputSelectedTime: initialDate,
            };
        }
        case AppActionTypeEnum.ChangeSelectedTime: {
            const newTime = new Date(state.inputSelectedTime.toDateString() + ', ' + action.data);
            return {
                ...state,
                inputSelectedTime: newTime,
            };
        }
        case AppActionTypeEnum.ChangeSelectedDate: {
            const newTime = new Date(action.data + ', ' + state.inputSelectedTime.toLocaleTimeString('hr-HR'));
            return {
                ...state,
                inputSelectedTime: newTime,
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
