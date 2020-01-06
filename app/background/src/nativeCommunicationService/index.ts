import { CallbackFunction, ContentScriptMessageTypeEnum, Tab } from 'common';

export class NativeCommunicationService {
    constructor() {
        this.connectToNativeApp();
    }

    private connectToNativeApp = () => {
        const port = chrome.runtime.connectNative('shutdown.extension.host');
        port.onDisconnect.addListener(() => {
            chrome.tabs.query({ active: true}, (res: Tab[]) => {
                chrome.tabs.sendMessage(res[0]?.id ? res[0].id : 0, {
                    type: ContentScriptMessageTypeEnum.TriggerAlert,
                    data: 'Shutdown Extension Host Application is disconnected. Try installing it again.',
                });
            });
        });
    }

    public shutdownCommand = (sendResponse: CallbackFunction) => {
        // port.postMessage({ text: '#SHUTDOWN#'});
    }
}

const service = new NativeCommunicationService();
export default service;
