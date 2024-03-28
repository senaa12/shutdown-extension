import {
    CallbackFunction,
    ChromeApiMessage,
    ContentScriptMessageTypeEnum,
    logger,
    MessageSender} from 'common';
import { Store } from '@eduardoac-skimlinks/webext-redux';
import { removeShutdown, SubscribeToVideoEnd } from './shutdownEvent';
import { checkVideoAvailability } from './videoDetection';
import { blurIframe, focusIframe } from './highlightIframe';

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
            case ContentScriptMessageTypeEnum.FocusIframe: {
                focusIframe();
                break;
            }
            case ContentScriptMessageTypeEnum.BlurIframe: {
                blurIframe();
                break;
            }
        }
};

const store = new Store();
store.ready().then(() => {
    // when tab opens register message handler
    chrome.runtime.onMessage.addListener(logger(messageHandler, isProduction));
});
export default store;
