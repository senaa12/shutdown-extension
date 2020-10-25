import {  ActionResultEnum, actionResultsStrings, BackgroundMessageTypeEnum, calculateSeconds, ChromeApiMessage } from 'common';
import store from './';
import { removeShutdownInStore, scheduleShutdownAction, triggerTooltipWithMessage } from './actions';

export const removeShutdown = (dontShouTooltip: boolean = false) => {
    const event = store.getState().appReducer.shutdownEvent;
    clearInterval(event);

    removeShutdownInStore();
    if (!dontShouTooltip) {
        triggerTooltipWithMessage(actionResultsStrings.cancel.canceled, ActionResultEnum.Canceled);
    }

    chrome.runtime.sendMessage({
        type: BackgroundMessageTypeEnum.ChangeIcon,
        data: false,
    } as ChromeApiMessage);
};

// shutdown function
export const checkVideoForShutdown = (selectedTime: number, duration: number) => {
    const videoTag = Array.from(document.getElementsByTagName('video')).find((obj) =>
        obj.duration && Math.round(obj.duration) === duration) as HTMLMediaElement;

    if (videoTag.currentTime - 1 < selectedTime &&  videoTag.currentTime > selectedTime) {
        removeShutdown(true);
        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.ShutdownComputer,
        } as ChromeApiMessage);
    } else if (selectedTime - videoTag.currentTime <= 60 && selectedTime - videoTag.currentTime > 59) {
        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.TriggerNotification,
        } as ChromeApiMessage);
    }
};

// setter
export const SubscribeToVideoEnd = (selectedTime: string, duration: number) => {
    try {
        const seconds = calculateSeconds(selectedTime);
        const videoTag = Array.from(document.getElementsByTagName('video')).find((obj) =>
            obj.duration && Math.round(obj.duration) === duration) as HTMLMediaElement;
        if (!videoTag || videoTag.currentTime > seconds) {
            scheduleShutdownAction({ success: false });
            triggerTooltipWithMessage(actionResultsStrings.shutdown.failed, ActionResultEnum.Shutdown);
        }

        const func = setInterval(() => checkVideoForShutdown(seconds, duration), 1000);
        scheduleShutdownAction({ success: true, event: func });
        triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);

        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.ChangeIcon,
            data: true,
        } as ChromeApiMessage);
    } catch (e) {
        console.error(e);

        scheduleShutdownAction({ success: false });
        triggerTooltipWithMessage(actionResultsStrings.shutdown.failed, ActionResultEnum.Shutdown);
    }
    return;
};
