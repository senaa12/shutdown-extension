import { Action, ActionResultEnum, ActionTypeEnum, BackgroundMessageTypeEnum, calculateSeconds } from 'common';
import store from '.';

export const removeSubscription = () => {
    const event = store.getState().appReducer.event;
    clearInterval(event);

    store.dispatch({ type: ActionTypeEnum.RemoveVideoEndSubscription });

    const resultAction: Action = {
        type: ActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Canceled,
            message: 'cancel',
        },
    };
    store.dispatch(resultAction);
};

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
    const resultAction: Action = {
        type: ActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Shutdown,
        },
    };

    try {
        const videoTag = document.getElementsByTagName('video')[0];
        const seconds = calculateSeconds(selectedTime);
        if (videoTag.currentTime + seconds > videoTag.duration) {
            throw new Error('not valid time');
        }
        const func = setInterval(() => checkVideoForShutdown(seconds), 1000);
        action.data = { success: true, event: func };
        store.dispatch(action);

        resultAction.data.message = 'Complete';
        store.dispatch(resultAction);
    } catch (e) {
        // tslint:disable-next-line: no-console
        console.error(e);

        action.data = { success: false };
        store.dispatch(action);

        resultAction.data.message = 'Failed';
        store.dispatch(resultAction);
    }
    return;
};
