import { Action,
    ActionTypeEnum,
    TabState} from 'common';
import store from '.';

export const checkVideoAvailability = () => {
    const videoTag = document.getElementsByTagName('video');
    const action: Action = {
        type: ActionTypeEnum.CheckTabVideoAvailability,
    };
    if (videoTag.length) {
        videoTag[0].onloadedmetadata = () => {
            action.data =  {
                documentHasVideoTag: true,
                videoDuration: videoTag[0].duration,
            } as TabState;
            store.dispatch(action);
        };
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
