import { ActiveTabReducerState, TabState, TabStateEnum } from "common";
import store from ".";

const iframeID = 'id-to-blur-iframe';

export const focusIframe = () => {
    const currentTabState = getCurrentTabState();
    if (currentTabState.state !== TabStateEnum.PageContainsIFrameTag) {
        return;
    }

    const iframe = Array.from(document.getElementsByTagName('iframe'))
            .find((ifr) => ifr.src === currentTabState.src);
    if (iframe === null) {
        return;
    }

    const boundingClientRect = iframe!.getBoundingClientRect();

    const newDiv = document.createElement("div");
    newDiv.id = iframeID;
    newDiv.style.position = 'fixed';
    newDiv.style.top = `${boundingClientRect.top}px`;
    newDiv.style.left = `${boundingClientRect.left}px`;
    newDiv.style.width = `${boundingClientRect.width}px`;
    newDiv.style.height = `${boundingClientRect.height}px`;
    newDiv.style.background = '#5897e0';
    newDiv.style.opacity = '0.6';
    newDiv.style.zIndex = `1000`;

    document.body.appendChild(newDiv);
}

export const blurIframe = () => {
    const newDiv = document.getElementById(iframeID);
    if (newDiv !== null) {
        newDiv.remove();
    }
}

const getCurrentTabState = () => {
    const activeReducer: ActiveTabReducerState = store.getState().activeTabReducer;
    return {
        state: activeReducer.state,
        src: activeReducer.src,
        videoDuration: activeReducer.videoDuration,
    } as TabState;
}