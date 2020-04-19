import { AppActionTypeEnum, nativeAppTitle } from 'common';
import { EchoNativeMessage, NativeMessageTypeEnum } from 'common-host';
import { store } from '../';

export const connecToNativeApp = () => {
    const response = (resp: any) => {
        const isHostActive = !!resp?.data.isActive;
        store.dispatch({
            type: AppActionTypeEnum.IsHostActiveCheck,
            data: isHostActive,
        });
    };
    const message: EchoNativeMessage = {
        type: NativeMessageTypeEnum.Echo,
        data: {
            isActive: true,
        },
    };

    chrome.runtime.sendNativeMessage(
        nativeAppTitle,
        message,
        response,
    );
};

export const shutdownCommand = (sendResponse?: any) => {
    const message = { text: '#SHUTDOWN#'};

    chrome.runtime.sendNativeMessage(
        nativeAppTitle,
        message,
    );
};
