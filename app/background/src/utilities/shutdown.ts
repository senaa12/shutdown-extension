import { Action, ActionResultActionTypeEnum, ActionResultEnum,
    actionResultsStrings, AppActionTypeEnum, calculateSeconds, convertSecondsToTimeFormat } from 'common';
import { store } from '..';
import { changeIcon } from './changeIcon';
import { shutdownCommand } from './nativeCommunication';

export const removeShutdownEvent = () => {
    const event = store.getState().appReducer.shutdownEvent;
    try {
        clearInterval(event);
    } catch (ex) {
        clearTimeout(event);
    }

    store.dispatch({ type: AppActionTypeEnum.RemoveScheduledShutdown });

    const resultAction: Action = {
        type: ActionResultActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Canceled,
            message: actionResultsStrings.cancel.canceled,
        },
    };
    store.dispatch(resultAction);
    changeIcon(false);
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

    const time = store.getState().appReducer.inputSelectedTime;
    if (calculateSeconds(time) < 10) {
        resultAction.data.message = actionResultsStrings.shutdown.failedCountdown;
        store.dispatch(resultAction);
    } else {
        const func = setInterval(() => countdownInterval(), 1000);
        action.data = { success: true, event: func };
        store.dispatch(action);

        resultAction.data.message = actionResultsStrings.shutdown.success;
        store.dispatch(resultAction);
        changeIcon(true);
    }
};

export const timerShutdown = () => {
    const action: Action = {
        type: AppActionTypeEnum.ScheduleShutdown,
    };
    const resultAction: Action = {
        type: ActionResultActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Shutdown,
        },
    };

    const selectedTime = new Date(store.getState().appReducer.inputSelectedDateTime);
    const currentTime = new Date();
    if (currentTime > selectedTime) {
        resultAction.data.message = actionResultsStrings.shutdown.failedTimer;
        store.dispatch(resultAction);
    } else {
        const delay = selectedTime.getTime() - currentTime.getTime();
        const func = setTimeout(() => shutdownCommand(), delay);
        action.data = { success: true, event: func };
        store.dispatch(action);

        resultAction.data.message = actionResultsStrings.shutdown.success;
        store.dispatch(resultAction);
        changeIcon(true);
    }
};
