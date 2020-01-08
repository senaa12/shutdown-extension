import { ActionTypeEnum, nativeAppTitle } from 'common';
import { store } from '../';

export const connecToNativeApp = () => {
    const response = (resp: any) => {
        const isHostActive = !!resp?.isActive;
        store.dispatch({
            type: ActionTypeEnum.IsHostActiveCheck,
            data: isHostActive,
        });
    };
    const message = { text: '#PING#' };

    chrome.runtime.sendNativeMessage(
        nativeAppTitle,
        message,
        response,
    );
};

export const shutdownCommand = (sendResponse: any) => {
    const message = { text: '#SHUTDOWN#'};

    chrome.runtime.sendNativeMessage(
        nativeAppTitle,
        message,
    );
};
