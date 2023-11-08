import {
    ActionResultEnum,
    actionResultsStrings,
    ActiveTabReducerState,
    ApplicationModeEnum,
    BackgroundMessageTypeEnum,
    CallbackFunction,
    convertSecondsToTimeFormat,
    sendMessageToBackgroundPage,
    StorageLocalKeys,
    TabState,
    TabStateEnum,
} from 'common';
import store from '.';
import { changeInputSelectedTime, sendResultingTabState, triggerTooltipWithMessage } from './actions';

export const checkVideoAvailability = async(data: any, sendResponse?: CallbackFunction) => {
    triggerTooltipWithMessage('', ActionResultEnum.None);

    const videoTag: Array<HTMLMediaElement> = Array.from(document.getElementsByTagName('video'));
    const currentState: TabState = getCurrentTabState();
    if (videoTag.length) {
        // page has video tag so we check duration
        if (!videoTag[0].duration || isNaN(videoTag[0].duration)) {
            videoTag[0].onloadedmetadata = () => checkVideoAvailability({ ...data });
        } else if (videoTag[0].duration.toString() === 'Infinity') {
            // if infinity => delay, possible bug
            setTimeout(() => checkVideoAvailability({ showResponse: true, ...data }), 1500);
            return;
        } else {
            let videoDuration: number | undefined;
            let videoSource: string | undefined;

            // if there is video on tab and is already scaned iterate throught next
            if (!!currentState.videoDuration) {
                // find it by duration and video source
                const index = videoTag.findIndex((obj) =>
                                    obj.duration
                                    && Math.round(obj.duration) === currentState.videoDuration
                                    && obj.src === currentState.src);

                let idx = 1;
                while(idx < videoTag.length) {
                    const potentialDuration = videoTag[(index + idx) % videoTag.length].duration;
                    const potentialSrc = videoTag[(index + idx) % videoTag.length].src;

                    if (!isNaN(potentialDuration)) {
                        videoDuration = potentialDuration;
                        videoSource = potentialSrc;
                    }
                    else {
                        idx = idx+1;
                    }
                }

                if (!videoDuration) {
                    videoDuration = currentState.videoDuration;
                    videoSource = currentState.src;
                }
            } else {
                videoDuration = videoTag[0].duration;
                videoSource = videoTag[0].src;
            }

            // only change input state if application mode is video player
            const currentAppMode = store.getState().appReducer.selectedApplicationMode;
            if (currentAppMode === ApplicationModeEnum.VideoPlayer) {
                // set input selected time to end
                changeInputSelectedTime(convertSecondsToTimeFormat(videoDuration, true));
            }

            // set tab state
            sendResultingTabState({
                state: TabStateEnum.PageContainsVideoTag,
                videoDuration: Math.round(videoDuration),
                src: videoSource,
            });

            // tooltip
            if (currentState.src !== videoSource) {
                triggerTooltipWithMessage(actionResultsStrings.scanNow.videoFound, ActionResultEnum.Scan);
            } else if (!!data?.showResponse) {
                triggerTooltipWithMessage(actionResultsStrings.scanNow.noChanges, ActionResultEnum.Scan);
            }

            return;
        }
    }

    const iframeSourcesToIgnore = await sendMessageToBackgroundPage<Array<string>>({
        type: BackgroundMessageTypeEnum.LoadStorageLocal,
        data: StorageLocalKeys.IframeAdsSources,
    });
    const isSourceInIgnoredIframeSources = (src: string): boolean => (
        iframeSourcesToIgnore.filter((val) => src.includes(val)).length > 0
    );

    // maybe video tag does not exist but IFrame exists on page
    const iframe = Array.from(document.getElementsByTagName('iframe'))
                        .filter((ifr) => !isSourceInIgnoredIframeSources(ifr.src));
    if (iframe.length) {
        // has Iframe source but lets filter it
        const withSrc = iframe.filter((ifr) => ifr.src);
        if (!withSrc.length || (withSrc[0]?.src === currentState?.src && !currentState?.src)) {
            iframe[0].onload = () => checkVideoAvailability({ showResponse: true, ...data });
        } else {
            let iframeSrc: string;
            // same as video tag if there is more iframe sources as before iterate through it
            if (!!currentState.src) {
                const index = withSrc.findIndex((obj) => obj.src === currentState.src);
                iframeSrc = withSrc[(index + 1) % withSrc.length].src;
            } else {
                iframeSrc = withSrc[0].src;
            }

            // set tab state
            sendResultingTabState({
                state: TabStateEnum.PageContainsIFrameTag,
                src: iframeSrc,
            });

            // tooltip
            if (iframeSrc !== currentState.src) {
                triggerTooltipWithMessage(actionResultsStrings.scanNow.iFrameFound, ActionResultEnum.Scan);
            } else if (!!data?.showResponse) {
                triggerTooltipWithMessage(actionResultsStrings.scanNow.noChanges, ActionResultEnum.Scan);
            }
        }
        return;
    }

    if (!(currentState?.state === TabStateEnum.WaitingForFirstLoad) || !!data?.showResponse) {
        // set tab state
        sendResultingTabState({ state: TabStateEnum.PageCannotUseThisExtension });

        // tooltip
        triggerTooltipWithMessage(actionResultsStrings.scanNow.nothingFound, ActionResultEnum.Scan);
    } else {
        // if nothing is found and it is first check => check again
        setTimeout(() => checkVideoAvailability({ showResponse: true }), 2500);
    }

};

const getCurrentTabState = () => {
    const activeReducer: ActiveTabReducerState = store.getState().activeTabReducer;
    return {
        state: activeReducer.state,
        src: activeReducer.src,
        videoDuration: activeReducer.videoDuration,
    } as TabState;
};
