import {  ActionResultEnum, actionResultsStrings, BackgroundMessageTypeEnum, calculateSeconds, ChromeApiMessage } from 'common';
import { scheduleShutdownAction, triggerTooltipWithMessage } from './actions';

// shutdown function
export const checkVideoForShutdown = (selectedTime: number) => {
    const videoTag = document.getElementsByTagName('video')[0];
    if (videoTag.currentTime > selectedTime) {
        const message = {
            type: BackgroundMessageTypeEnum.ShutdownComputer,
        };
        chrome.runtime.sendMessage(message,
            // (mess: string) => alert(mess)
        );

        chrome.runtime.sendMessage({
            type: BackgroundMessageTypeEnum.RemoveShutdownEvent,
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
