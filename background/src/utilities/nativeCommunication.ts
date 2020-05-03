import { AppActionTypeEnum, nativeAppTitle, RootReducerState, shutdownCommands } from 'common';
import { EchoNativeMessage, ExecuteCommandNativeMessage, NativeMessageTypeEnum } from 'common-native-client';
import { store } from '../';

export const connecToNativeApp = () => {
    const response = (resp: any) => {
        store.dispatch({
            type: AppActionTypeEnum.IsHostActiveCheck,
            data: !!resp?.data.isActive,
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
    const platform = (store.getState() as RootReducerState).appReducer.platformType;
    const message: ExecuteCommandNativeMessage = {
        type: NativeMessageTypeEnum.ExecuteCommand,
        command: shutdownCommands[platform],
    };

    chrome.runtime.sendNativeMessage(
        nativeAppTitle,
        message,
    );
};
