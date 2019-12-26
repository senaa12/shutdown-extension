import { Action,
    ActionTypeEnum,
    TabState} from 'common';
import store from '.';
import eventDetectionsOnVideo from './videoEvent';

export const checkVideoAvailability = () => {
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
        setInterval(() => eventDetectionsOnVideo(seconds), 1000);
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

