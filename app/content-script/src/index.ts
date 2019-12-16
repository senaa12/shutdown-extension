import {
    CallbackFunction,
    ContentScriptMessage,
    ContentScriptMessageTypeEnum,
    MessageSender } from 'common';
import { Store } from 'webext-redux';
import { SubscribeToVideoEnd } from './videoDetection';

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
    // TODO: tu ubaciti detekciju
    chrome.runtime.onMessage.addListener(messageHandler);
});
export default store;
