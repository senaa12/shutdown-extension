import {  ActionResultEnum, actionResultsStrings, BackgroundMessageTypeEnum, calculateSeconds, ChromeApiMessage } from 'common';
import store from './';
import { removeShutdownInStore, scheduleShutdownAction, triggerTooltipWithMessage } from './actions';

export const removeShutdown = () => {
    const event = store.getState().appReducer.shutdownEvent;
    clearInterval(event);

    removeShutdownInStore();
    triggerTooltipWithMessage(actionResultsStrings.cancel.canceled, ActionResultEnum.Canceled);

    chrome.runtime.sendMessage({
        type: BackgroundMessageTypeEnum.ChangeIcon,
        data: false,
    } as ChromeApiMessage);
};

// shutdown function
export const checkVideoForShutdown = (selectedTime: number) => {
    const videoTag = document.getElementsByTagName('video')[0];
    if (videoTag.currentTime > selectedTime) {
        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.ShutdownComputer,
        } as ChromeApiMessage);

        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.RemoveShutdownEvent,
        } as ChromeApiMessage);
    } else if (selectedTime - videoTag.currentTime <= 60 && selectedTime - videoTag.currentTime > 59) {
        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.TriggerNotification,
        } as ChromeApiMessage);
    }
};

// setter
export const SubscribeToVideoEnd = (selectedTime: string) => {
    try {
        const videoTag = document.getElementsByTagName('video')[0];
        const seconds = calculateSeconds(selectedTime);
        if (videoTag.currentTime > seconds) {
            throw new Error('not valid time');
        }

        const func = setInterval(() => checkVideoForShutdown(seconds), 1000);
        scheduleShutdownAction({ success: true, event: func });
        triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);

        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.ChangeIcon,
            data: true,
        } as ChromeApiMessage);
    } catch (e) {
        // tslint:disable-next-line: no-console
        console.error(e);

        scheduleShutdownAction({ success: false });
        triggerTooltipWithMessage(actionResultsStrings.shutdown.failed, ActionResultEnum.Shutdown);
    }
    return;
};
