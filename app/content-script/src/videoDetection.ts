import {
    ActionResultEnum,
    actionResultsStrings,
    CallbackFunction,
    convertSecondsToTimeFormat,
    TabState,
    TabStateEnum,
} from 'common';
import store from '.';
import { changeInputSelectedTime, sendResultingTabState, triggerTooltipWithMessage } from './actions';

export const checkVideoAvailability = async(data: any, sendResponse?: CallbackFunction) => {
    const videoTag = document.getElementsByTagName('video');
    const currentState: TabState = getCurrentTabState(data?.tabID);

    if (videoTag.length) {
        // page has video tag so we check duration
        if (!videoTag[0].duration || isNaN(videoTag[0].duration)) {
            videoTag[0].onloadedmetadata = () => checkVideoAvailability({ ...data });
        } else if (videoTag[0].duration.toString() === 'Infinity') {
            // if infinity => delay, possible bug
            setTimeout(() => checkVideoAvailability({ showResponse: true, ...data }), 1500);
        } else {
            // set input selected time to end
            changeInputSelectedTime(convertSecondsToTimeFormat(videoTag[0].duration, true));

            // set tab state
            sendResultingTabState({
                state: TabStateEnum.PageContainsVideoTag,
                videoDuration: Math.round(videoTag[0].duration),
            });

            // tooltip
            triggerTooltipWithMessage(actionResultsStrings.scanNow.videoFound, ActionResultEnum.Scan);
        }
        return;
    }

    // maybe video tag does not exist but IFrame exists on page
    const iframe = Array.from(document.getElementsByTagName('iframe'));
    if (iframe.length) {
        // has Iframe source but lets filter it
        const withSrc = iframe.filter((ifr) => ifr.src && !isSourceInIgnoredIframeSources(ifr.src));
        if (!withSrc.length || withSrc[0]?.src === currentState?.iframeSource) {
            iframe[0].onload = () => checkVideoAvailability({ showResponse: true, ...data });
        } else {
            // set tab state
            sendResultingTabState({
                state: TabStateEnum.PageContainsIFrameTag,
                iframeSource: withSrc[0].src,
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

const iframeSourcesToIgnore = [
    'ogs.google.com',
    'comments',
    'google_ads_iframe',
    'googleads',
];
const isSourceInIgnoredIframeSources = (src: string): boolean => {
    return iframeSourcesToIgnore.filter((val) => src.includes(val)).length > 0;
};

const getCurrentTabState = (tabID: number) => {
    return tabID ? store.getState().openTabsReducer[tabID] : undefined;
};
