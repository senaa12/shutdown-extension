import { Action,
    ActionResultEnum,
    actionResultsStrings,
    ActionTypeEnum,
    CallbackFunction,
    TabState} from 'common';
import store from '.';

export const checkVideoAvailability = async(data: any, sendResponse?: CallbackFunction) => {
    const videoTag = document.getElementsByTagName('video');
    const currentState: TabState = getCurrentTabState(data?.tabID);
    const shouldSendResponseToPopup: boolean = data?.tabID !== undefined;

    const action: Action = {
        type: ActionTypeEnum.CheckTabVideoAvailability,
    };
    const resultAction: Action = {
        type: ActionTypeEnum.TriggerTooltip,
        data: {
            type: ActionResultEnum.Scan,
        },
    };

    if (videoTag.length) {
        if (!videoTag[0].duration) {
            if (!videoTag[0].onloadedmetadata) {
                videoTag[0].onloadedmetadata = () => checkVideoAvailability({});
            }

            action.data =  {
                documentHasVideoTag: false,
                documentHasIFrameTag: false,
            } as TabState;
            store.dispatch(action);

        } else {
            action.data =  {
                documentHasVideoTag: true,
                videoDuration: videoTag[0].duration,
            } as TabState;
            store.dispatch(action);
        }

        if (shouldSendResponseToPopup) {
            if (videoTag[0].duration && !currentState.documentHasVideoTag) {
                resultAction.data.message = actionResultsStrings.scanNow.videoFound;
                store.dispatch(resultAction);
            } else {
                resultAction.data.message = actionResultsStrings.scanNow.noChanges;
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

            action.data =  {
                documentHasVideoTag: false,
                documentHasIFrameTag: false,
            } as TabState;
            store.dispatch(action);

        } else {
            action.data =  {
                documentHasIFrameTag: true,
                iframeSource: iframe[0].src,
            } as TabState;
            store.dispatch(action);
        }

        if (shouldSendResponseToPopup) {
            if (iframe[0].src && !currentState.iframeSource) {
                resultAction.data.message = actionResultsStrings.scanNow.iFrameFound;
                store.dispatch(resultAction);
            } else {
                resultAction.data.message = actionResultsStrings.scanNow.noChanges;
                store.dispatch(resultAction);
            }
        }
        return;
    }

    action.data =  {
            documentHasVideoTag: false,
            documentHasIFrameTag: false,
        } as TabState;
    store.dispatch(action);
    if (shouldSendResponseToPopup) {
        resultAction.data.message = actionResultsStrings.scanNow.noChanges;
        store.dispatch(resultAction);
    }
};

const getCurrentTabState = (tabID: number) => {
    return tabID ? store.getState().openTabsReducer.tabs[tabID] : undefined;
};
