import { Action, ActionResultActionTypeEnum, ActionResultEnum,
    actionResultsStrings, AppActionTypeEnum, calculateSeconds, convertSecondsToTimeFormat } from 'common';
import { store } from '..';
import { shutdownCommand } from './nativeCommunication';

export const removeShutdownEvent = () => {
    const event = store.getState().appReducer.shutdownEvent;
    clearInterval(event);

    store.dispatch({ type: AppActionTypeEnum.RemoveScheduledShutdown });

    const resultAction: Action = {
        type: ActionResultActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Canceled,
            message: actionResultsStrings.cancel.canceled,
        },
    };
    store.dispatch(resultAction);
};

export const countdownShutdownEvent = () => {
    const countdownInterval = () => {
        const seconds = calculateSeconds(store.getState().appReducer.inputSelectedTime) - 1;
        if (seconds < 1) {
            shutdownCommand();
        } else {
            store.dispatch({
                type: AppActionTypeEnum.ChangeSelectedTime,
                data: convertSecondsToTimeFormat(seconds, true),
            });
        }
    };

    const action: Action = {
        type: AppActionTypeEnum.ScheduleShutdown,
    };
    const resultAction: Action = {
        type: ActionResultActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Shutdown,
        },
    };

    if (calculateSeconds(store.getState().appReducer.inputSelectedTime) < 10) {
        resultAction.data.message = actionResultsStrings.shutdown.failedCountdown;
        store.dispatch(resultAction);
    } else {
        const func = setInterval(() => countdownInterval(), 1000);
        action.data = { success: true, event: func };
        store.dispatch(action);

        resultAction.data.message = actionResultsStrings.shutdown.success;
        store.dispatch(resultAction);
    }
};

export const timerShutdown = () => {
    const selectedTime = store.getState().appReducer.inputSelectedTime;
};
