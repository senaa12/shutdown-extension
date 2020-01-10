import { Action,
    ActionResultActionTypeEnum,
    ActionResultEnum,
    actionResultsStrings,
    CallbackFunction,
    TabsActionTypeEnum,
    TabState} from 'common';
import store from '.';

export const checkVideoAvailability = async(data: any, sendResponse?: CallbackFunction) => {
    const videoTag = document.getElementsByTagName('video');
    const currentState: TabState = getCurrentTabState(data?.tabID);
    const shouldSendResponseToPopup: boolean = !!data?.showResponse;

    const action: Action = {
        type: TabsActionTypeEnum.CheckTabVideoAvailability,
    };
    const resultAction: Action = {
        type: ActionResultActionTypeEnum.TriggerTooltip,
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
                waitingForFirstLoad: true,
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
            if (videoTag[0].duration && !currentState?.documentHasVideoTag) {
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
    const iframe = Array.from(document.getElementsByTagName('iframe')).filter((ifr) => ifr.src);
    if (iframe.length) {
        if (iframe[0].src === currentState?.iframeSource || !iframe[0].src) {
            if (!iframe[0].onload) {
                iframe[0].onload = () => checkVideoAvailability({ showResponse: true });
            }

            action.data =  {
                waitingForFirstLoad: true,
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
            if (iframe[0].src && (!currentState?.iframeSource || iframe[0].src !== currentState?.iframeSource)) {
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
    return tabID ? store.getState().openTabsReducer[tabID] : undefined;
};
