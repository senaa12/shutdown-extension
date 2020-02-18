import {
    CallbackFunction,
    ChromeApiMessage,
    ContentScriptMessageTypeEnum,
    MessageSender} from 'common';
import { Store } from 'webext-redux';
import { removeShutdown, SubscribeToVideoEnd } from './shutdownEvent';
import { checkVideoAvailability } from './videoDetection';

const messageHandler = (
    request: ChromeApiMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
        switch (request.type) {
            case ContentScriptMessageTypeEnum.SubscribeToVideoEnd: {
                SubscribeToVideoEnd(request.data.selectedTime);
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

const store = new Store();
store.ready().then(() => {
    // when tab opens register message handler
    chrome.runtime.onMessage.addListener(messageHandler);
});
export default store;
