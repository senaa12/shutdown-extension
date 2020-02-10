import {  ActionResultEnum, actionResultsStrings, BackgroundMessage, BackgroundMessageTypeEnum, calculateSeconds } from 'common';

import store from '.';
import { removeScheduledShutdown, scheduleShutdownAction, triggerTooltipWithMessage } from './actions';

// remove
export const removeVideoScheduledShutdown = () => {
    const event = store.getState().appReducer.shutdownEvent;
    clearInterval(event);

    removeScheduledShutdown();

    triggerTooltipWithMessage(actionResultsStrings.cancel.canceled, ActionResultEnum.Canceled);

    const changeIconMessage: BackgroundMessage = {
        type: BackgroundMessageTypeEnum.ChangeIcon,
        data: false,
    };
    chrome.runtime.sendMessage(changeIconMessage);
};

// setters
export const checkVideoForShutdown = (selectedTime: number) => {
    const videoTag = document.getElementsByTagName('video')[0];
    if (videoTag.currentTime > selectedTime) {
        const message = {
            type: BackgroundMessageTypeEnum.ShutdownComputer,
        };
        chrome.runtime.sendMessage(message,
            // (mess: string) => alert(mess)
        );

        removeVideoScheduledShutdown();
    }
};

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

        const changeIconMessage: BackgroundMessage = {
            type: BackgroundMessageTypeEnum.ChangeIcon,
            data: true,
        };
        chrome.runtime.sendMessage(changeIconMessage);
    } catch (e) {
        // tslint:disable-next-line: no-console
        console.error(e);

        scheduleShutdownAction({ success: false });

        triggerTooltipWithMessage(actionResultsStrings.shutdown.failed, ActionResultEnum.Shutdown);
    }
    return;
};
