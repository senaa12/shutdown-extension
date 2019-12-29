import { Action,
    ActionTypeEnum,
    CallbackFunction,
    scanActionResultString,
    TabState} from 'common';
import store from '.';

export const checkVideoAvailability = (data: any, sendResponse?: CallbackFunction) => {
    const videoTag = document.getElementsByTagName('video');
    const action: Action = {
        type: ActionTypeEnum.CheckTabVideoAvailability,
    };
    if (videoTag.length) {
        videoTag[0].onloadedmetadata = () => {
            action.data =  {
                documentHasVideoTag: true,
                videoDuration: videoTag[0].duration,

            };
            store.dispatch(action);
        };
        if (sendResponse) {
            sendResponse('video');
        }
        return;
    }

    // maybe video tag does not exist but IFrame exists on page
    const iframe = document.getElementsByTagName('iframe');
    if (iframe.length) {
        // iframe[0].onloadedmetadata = () => {
            action.data =  {
                documentHasIFrameTag: true,
                iframeSource: iframe[0].src,
            } ;
            store.dispatch(action);
            if (sendResponse) {
                sendResponse('iframe');
            }
        // };
            return;
    }

    action.data =  {
            documentHasVideoTag: false,
            documentHasIFrameTag: false,
            actionResultMessage: data.returnMessage && scanActionResultString.noResult,
        };
    store.dispatch(action);
    if (sendResponse) {
        sendResponse('none');
    }
};
