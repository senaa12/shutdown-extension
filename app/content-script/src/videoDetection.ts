import { Action,
    ActionResultActionTypeEnum,
    ActionResultEnum,
    actionResultsStrings,
    AppActionTypeEnum,
    CallbackFunction,
    convertSecondsToTimeFormat,
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

    console.log('doso si tu');
    console.log(data);
    console.log(currentState);
    console.log('videotag');
    console.log(videoTag);
    if (videoTag.length) {
        console.log(videoTag[0].duration);
        if (!videoTag[0].duration) {
            videoTag[0].onloadedmetadata = () => checkVideoAvailability({ ...data });

        } else {
            store.dispatch({
                type: AppActionTypeEnum.ChangeSelectedTime,
                data: convertSecondsToTimeFormat(videoTag[0].duration, true),
            });

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
    const iframe = Array.from(document.getElementsByTagName('iframe'));
    console.log('iframe');
    console.log(iframe);
    if (iframe.length) {
        const withSrc = iframe.filter((ifr) => ifr.src);
        console.log(withSrc);
        if (!withSrc.length || withSrc[0]?.src === currentState?.iframeSource) {
            withSrc[0].onload = () => checkVideoAvailability({ showResponse: true, ...data });
        } else {
            action.data =  {
                documentHasIFrameTag: true,
                iframeSource: withSrc[0].src,
            } as TabState;
            store.dispatch(action);
        }

        if (shouldSendResponseToPopup) {
            if (withSrc[0].src && (!currentState?.iframeSource || withSrc[0].src !== currentState?.iframeSource)) {
                resultAction.data.message = actionResultsStrings.scanNow.iFrameFound;
                store.dispatch(resultAction);
            } else {
                resultAction.data.message = actionResultsStrings.scanNow.noChanges;
                store.dispatch(resultAction);
            }
        }
        return;
    }

    if (!currentState?.waitingForFirstLoad) {
        action.data =  {
            documentHasVideoTag: false,
            documentHasIFrameTag: false,
        } as TabState;
        store.dispatch(action);

        if (shouldSendResponseToPopup) {
            resultAction.data.message = actionResultsStrings.scanNow.noChanges;
            store.dispatch(resultAction);
        }
    } else {
        store.dispatch({
            type: TabsActionTypeEnum.SetWaitingForFirstLoad,
            data: {
                tabID: data.tabID,
                waitingToFirstLoad: false,
            },
        });

        setTimeout(() => checkVideoAvailability({ showResponse: true }), 500);
    }

};

const getCurrentTabState = (tabID: number) => {
    return tabID ? store.getState().openTabsReducer[tabID] : undefined;
};
