import { Action, ActionResultActionTypeEnum, ActionResultEnum,
    actionResultsStrings, AppActionTypeEnum, BackgroundMessageTypeEnum, calculateSeconds } from 'common';
import store from '.';

// remove
export const removeVideoScheduledShutdown = () => {
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

// setters
export const checkVideoForShutdown = (selectedTime: number) => {
    const videoTag = document.getElementsByTagName('video')[0];
    if (videoTag.currentTime > selectedTime) {
        const message = {
            type: BackgroundMessageTypeEnum.ShutdownComputer,
        };
        chrome.runtime.sendMessage(message,
            // ,(mess: string) => alert(mess)
            );
        removeVideoScheduledShutdown();
    }
};

export const SubscribeToVideoEnd = (selectedTime: string) => {
    const action: Action = {
        type: AppActionTypeEnum.ScheduleShutdown,
    };
    const resultAction: Action = {
        type: ActionResultActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Shutdown,
        },
    };

    try {
        const videoTag = document.getElementsByTagName('video')[0];
        const seconds = calculateSeconds(selectedTime);
        if (videoTag.currentTime > seconds) {
            throw new Error('not valid time');
        }
        const func = setInterval(() => checkVideoForShutdown(seconds), 1000);
        action.data = { success: true, event: func };
        store.dispatch(action);

        resultAction.data.message = actionResultsStrings.shutdown.success;
        store.dispatch(resultAction);
    } catch (e) {
        // tslint:disable-next-line: no-console
        console.error(e);

        action.data = { success: false };
        store.dispatch(action);

        resultAction.data.message = actionResultsStrings.shutdown.failed;
        store.dispatch(resultAction);
    }
    return;
};

export const removeCountdownToShutdow = () => {
    const message = {
        type: BackgroundMessageTypeEnum.RemoveCountdownToShutdown,
    };

    chrome.runtime.sendMessage(message);
};

export const countdownToShutdown = () => {
    const message = {
        type: BackgroundMessageTypeEnum.CountdownToShutdown,
    };

    chrome.runtime.sendMessage(message);
};

export const checkNativeApp = () => {
    const message = {
        type: BackgroundMessageTypeEnum.CheckNativeApp,
    };

    chrome.runtime.sendMessage(message);
};
