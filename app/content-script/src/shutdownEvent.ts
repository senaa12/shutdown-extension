import { Action, ActionTypeEnum, BackgroundMessageTypeEnum } from 'common';
import store from '.';

export const checkVideoForShutdown = (selectedTime: number) => {
    const videoTag = document.getElementsByTagName('video')[0];
    if (videoTag.currentTime + selectedTime > videoTag.duration) {
        const message = {
            type: BackgroundMessageTypeEnum.ShutdownComputer,
        };
        chrome.runtime.sendMessage(message);
    }
};

export const SubscribeToVideoEnd = (selectedTime: string) => {
    const action: Action = {
        type: ActionTypeEnum.SubscribedToVideoEnd,
    };

    try {
        const videoTag = document.getElementsByTagName('video')[0];
        const seconds = calculateSeconds(selectedTime);
        if (videoTag.currentTime + seconds > videoTag.duration) {
            throw new Error('not valid time');
        }
        setInterval(() => checkVideoForShutdown(seconds), 1000);
    } catch {
        action.data = { success: false };
        store.dispatch(action);
        return;
    }

    action.data = { success: true };
    store.dispatch(action);
    return;
};

const calculateSeconds = (selectedTime: string) => {
    const values =  selectedTime.split(':');
    let numberOfSeconds = 0;
    numberOfSeconds += parseInt(values[0]) * 60 * 60;
    numberOfSeconds += parseInt(values[1]) * 60;
    numberOfSeconds += values[2] ? parseInt(values[2]) : 0;
    return numberOfSeconds;
};
