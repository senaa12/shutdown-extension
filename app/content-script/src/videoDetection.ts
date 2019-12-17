import { Action,
    ActionTypeEnum,
    TabState} from 'common';
import store from '.';

export const checkVideoAvailability = () => {
    console.log('detect');
    const videoTag = document.getElementsByTagName('video');
    const action: Action = {
        type: ActionTypeEnum.CheckTabVideoAvailability,
    };
    if (videoTag.length) {
        action.data =  {
                documentHasVideoTag: true,
            } as TabState;
        store.dispatch(action);
        return;
    }

    // maybe video tag does not exist but IFrame exists on page
    const iframe = document.getElementsByTagName('iframe');
    if (iframe.length) {
        action.data =  {
                documentHasIFrameTag: true,
                iframeSource: iframe[0].src,
            } as TabState;
        store.dispatch(action);
        return;
    }

    action.data =  {
            documentHasVideoTag: false,
            documentHasIFrameTag: false,
        } as TabState;
    store.dispatch(action);
};

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
