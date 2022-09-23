import {
    CallbackFunction,
    ChromeApiMessage,
    ContentScriptMessageTypeEnum,
    logger,
    MessageSender,
    REACT_APP_REDUX_PORT} from 'common';
import { Store } from '@eduardoac-skimlinks/webext-redux';
import { removeShutdown, SubscribeToVideoEnd } from './shutdownEvent';
import { checkVideoAvailability } from './videoDetection';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

const messageHandler = (
    request: ChromeApiMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
        switch (request.type) {
            case ContentScriptMessageTypeEnum.SubscribeToVideoEnd: {
                SubscribeToVideoEnd(request.data.selectedTime, request.data.videoDuration, request.data.videoSrc);
                break;
            }
            case ContentScriptMessageTypeEnum.CheckVideoAvailability: {
                checkVideoAvailability(request.data);
                break;
            }
            case ContentScriptMessageTypeEnum.RemoveVideoShutdownEvent: {
                removeShutdown();
                break;
            }
        }
};

const proxyStore = new Store({
	portName: REACT_APP_REDUX_PORT
});

proxyStore.ready().then(() => {
    // when tab opens register message handler
    chrome.runtime.onMessage.addListener(logger(messageHandler, isProduction));
});

export default proxyStore;