import { BackgroundMessage, BackgroundMessageTypeEnum, CallbackFunction, MessageSender } from 'common';

const messageHandler = (
    request: BackgroundMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
        switch (request.type) {
            case BackgroundMessageTypeEnum.ShutdownComputer: {
                // const port = chrome.runtime.connectNative('sena.test.app');
                // port.postMessage({ text: 'sena,m'});
                // port.onMessage.addListener((resp) => { console.log(resp) })
                return;
            }
            default: {
                throw new Error('message handler not defined');
            }
        }

};

export default messageHandler;
