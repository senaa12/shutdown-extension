import {
    CallbackFunction,
    ContentScriptMessage,
    ContentScriptMessageTypeEnum,
    MessageSender } from 'common';
import { Store } from 'webext-redux';
import { checkVideoAvailability, SubscribeToVideoEnd } from './videoDetection';

const messageHandler = (
    request: ContentScriptMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
    switch (request.type) {
        case ContentScriptMessageTypeEnum.SubscribeToVideoEnd: {
            SubscribeToVideoEnd();
            break;
        }
        default:
            throw new Error('Handler for message is not defined!');
    }
};

const store = new Store();
store.ready().then(() => {
    // when tab opens check if video tab is available and save state to store
    checkVideoAvailability();

    // window.addEventListener('hashchange', console.log);

    // when tab opens register message handler
    chrome.runtime.onMessage.addListener(messageHandler);
});
export default store;
