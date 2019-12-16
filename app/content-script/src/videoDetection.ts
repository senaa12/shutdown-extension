import { Action,
    ActionTypeEnum } from 'common';
import store from '.';

export const SubscribeToVideoEnd = () => {
    const subscribed = (e: any) => {
        // tslint:disable-next-line: no-console
        console.log('video end');

        // chrome.runtime.sendMessage({ mess: request });
    };

    const action: Action = {
        type: ActionTypeEnum.SubscribedToVideoEnd,
    };

    try {
        const videoTag = document.getElementsByTagName('video');
        videoTag[0].addEventListener('ended', subscribed);
    } catch {
        action.data = { success: false };
        store.dispatch(action);
        return;
    }

    action.data = { success: true };
    store.dispatch(action);
    return;
};
