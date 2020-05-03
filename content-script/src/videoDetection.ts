import {
    ActionResultEnum,
    actionResultsStrings,
    ActiveTabReducerState,
    CallbackFunction,
    convertSecondsToTimeFormat,
    TabState,
    TabStateEnum,
} from 'common';
import store from '.';
import { changeInputSelectedTime, sendResultingTabState, triggerTooltipWithMessage } from './actions';

export const checkVideoAvailability = async(data: any, sendResponse?: CallbackFunction) => {
    const videoTag: Array<HTMLMediaElement> = Array.from(document.getElementsByTagName('video'));
    const currentState: TabState = getCurrentTabState();

    if (videoTag.length) {
        // page has video tag so we check duration
        if (!videoTag[0].duration || isNaN(videoTag[0].duration)) {
            videoTag[0].onloadedmetadata = () => checkVideoAvailability({ ...data });
        } else if (videoTag[0].duration.toString() === 'Infinity') {
            // if infinity => delay, possible bug
            setTimeout(() => checkVideoAvailability({ showResponse: true, ...data }), 1500);
        } else {
            let videoDuration: number;
            // if there is video on tab and is already scaned iterate throught next
            if (!!currentState.videoDuration) {
                // find it by duration, of course if there are 2 videos with same length this will not work
                // but what are the chances
                const index = videoTag.findIndex((obj) =>
                    obj.duration && Math.round(obj.duration) === currentState.videoDuration);
                videoDuration = videoTag[(index + 1) % videoTag.length].duration;
            } else {
                videoDuration = videoTag[0].duration;
            }

            // set input selected time to end
            changeInputSelectedTime(convertSecondsToTimeFormat(videoDuration, true));

            // set tab state
            sendResultingTabState({
                state: TabStateEnum.PageContainsVideoTag,
                videoDuration: Math.round(videoDuration),
            });

            // tooltip
            triggerTooltipWithMessage(actionResultsStrings.scanNow.videoFound, ActionResultEnum.Scan);
        }
        return;
    }

    // maybe video tag does not exist but IFrame exists on page
    const iframe = Array.from(document.getElementsByTagName('iframe'))
                        .filter((ifr) => !isSourceInIgnoredIframeSources(ifr.src));
    if (iframe.length) {
        // has Iframe source but lets filter it
        const withSrc = iframe.filter((ifr) => ifr.src);
        if (!withSrc.length || withSrc[0]?.src === currentState?.iframeSource) {
            iframe[0].onload = () => checkVideoAvailability({ showResponse: true, ...data });
        } else {
            let iframeSrc: string;
            // same as video tag if there is more iframe sources as before iterate through it
            if (!!currentState.iframeSource) {
                const index = iframe.findIndex((obj) => obj.src === currentState.iframeSource);
                iframeSrc = iframe[(index + 1) % iframe.length].src;
            } else {
                iframeSrc = iframe[0].src;
            }

            // set tab state
            sendResultingTabState({
                state: TabStateEnum.PageContainsIFrameTag,
                iframeSource: iframeSrc,
            });

            // tooltip
            triggerTooltipWithMessage(actionResultsStrings.scanNow.iFrameFound, ActionResultEnum.Scan);
        }
        return;
    }

    if (!(currentState?.state === TabStateEnum.WaitingForFirstLoad) || !!data?.showResponse) {
        // set tab state
        sendResultingTabState({ state: TabStateEnum.PageCannotUseThisExtension });

        // tooltip
        triggerTooltipWithMessage(actionResultsStrings.scanNow.noChanges, ActionResultEnum.Scan);
    } else {
        // if nothing is found and it is first check => check again
        setTimeout(() => checkVideoAvailability({ showResponse: true }), 2500);
    }

};

// iframe sources to ignore => mostly ads
const iframeSourcesToIgnore = [
    'ogs.google.com',
    'comments',
    'google_ads_iframe',
    'googleads',
    'googlesyndication.com',
    'facebook.com/v2.0/,plugins',
];
const isSourceInIgnoredIframeSources = (src: string): boolean => {
    return iframeSourcesToIgnore.filter((val) => src.includes(val)).length > 0;
};

const getCurrentTabState = () => {
    const activeReducer: ActiveTabReducerState = store.getState().activeTabReducer;
    return {
        state: activeReducer.state,
        iframeSource: activeReducer.iframeSource,
        videoDuration: activeReducer.videoDuration,
    } as TabState;
};
