import { ActionTypeEnum, CallbackFunction } from 'common';
import { store } from '..';

export class NativeCommunicationService {
    constructor() {
        this.connectToNativeApp();
    }

    public isHostActive: boolean = false;
    private port: chrome.runtime.Port;
    private connectToNative = () => this.port = chrome.runtime.connectNative('shutdown.extension.host');

    private checkActivity = (message: any) => {
        this.isHostActive = !!message?.isActive;
        this.port?.disconnect();
        store.dispatch({
            type: ActionTypeEnum.IsHostActiveCheck,
            data: this.isHostActive,
        });
    }

    private connectToNativeApp = () => {
        this.connectToNative();
        this.port.onDisconnect.addListener(() => {
            store.dispatch({
                type: ActionTypeEnum.IsHostActiveCheck,
                data: false,
            });
        });
        this.port.onMessage.addListener(this.checkActivity);
        this.port.postMessage({ text: '#PING#' });
    }

    public shutdownCommand = (sendResponse: CallbackFunction) => {
        this.connectToNative();
        this.port?.postMessage({ text: '#SHUTDOWN#'});
    }
}

const service = new NativeCommunicationService();
export default service;
