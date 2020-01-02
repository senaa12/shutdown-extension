import { Action,
    ActionResultEnum,
    ActionTypeEnum,
    CallbackFunction,
    TabState} from 'common';
import store from '.';

export const checkVideoAvailability = async(data: any, sendResponse?: CallbackFunction) => {
    const videoTag = document.getElementsByTagName('video');
    const currentState: TabState = getCurrentTabState(data?.tabID);

    const action: Action = {
        type: ActionTypeEnum.CheckTabVideoAvailability,
    };
    const resultAction: Action = {
        type: ActionTypeEnum.TriggerTooltip,
        data: ActionResultEnum.Scan,
    };

    if (videoTag.length) {
        if (!videoTag[0].duration) {
            if (!videoTag[0].onloadedmetadata) {
                videoTag[0].onloadedmetadata = () => checkVideoAvailability({});
            }
            store.dispatch(resultAction);
        } else {
            action.data =  {
                documentHasVideoTag: true,
                videoDuration: videoTag[0].duration,
            };
            store.dispatch(action);

            if (currentState && currentState.documentHasVideoTag) {
                store.dispatch(resultAction);
            }
        }
        return;
    }

    // maybe video tag does not exist but IFrame exists on page
    const iframe = document.getElementsByTagName('iframe');
    if (iframe.length) {
        if (!iframe[0].src) {
            if (!iframe[0].onloadedmetadata) {
                iframe[0].onloadedmetadata = () => checkVideoAvailability({});
            }
            store.dispatch(resultAction);
        } else {
            action.data =  {
                documentHasIFrameTag: true,
                iframeSource: iframe[0].src,
            } ;

            store.dispatch(action);
            if (currentState && currentState.iframeSource && currentState.iframeSource === iframe[0].src) {
                store.dispatch(resultAction);
            }
        }
        return;
    }

    action.data =  {
            documentHasVideoTag: false,
            documentHasIFrameTag: false,
        };
    store.dispatch(action);
    if (currentState && !currentState.documentHasIFrameTag && !currentState.documentHasVideoTag) {
        store.dispatch(resultAction);
    }
};

const getCurrentTabState = (tabID: number) => {
    return tabID ? store.getState().openTabsReducer.tabs[tabID] : undefined;
};
