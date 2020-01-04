import { CallbackFunction } from 'common';

export const shutdownFunction = (sendResponse: CallbackFunction) => {
        // const port = chrome.runtime.connectNative('sena.test.app');
        // port.onDisconnect.addListener(() => {
        //     sendResponse(chrome.runtime.lastError ? chrome.runtime.lastError.message : 'Shutdown failed');
        // });

        // port.postMessage({ text: '#STOP#'});
        // port.onMessage.addListener((resp) => { console.log('response'); console.log(resp); });
};
