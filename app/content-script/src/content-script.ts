import { CallbackFunction, ContentScriptMessage, ContentScriptMessageTypeEnum, MessageSender, ResponseType } from 'common';

const SubscribeToVideoEnd = (sendResponse: CallbackFunction) => {
    const subscribed = (e: any) => {
        // tslint:disable-next-line: no-console
        console.log('video end');
    };
    const videoTag = document.getElementsByTagName('video');
    videoTag[0].addEventListener('ended', subscribed);
    sendResponse(ResponseType.Success);
};

const messageHandler = (
    request: ContentScriptMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
    switch (request.type) {
        case ContentScriptMessageTypeEnum.SubscribeToVideoEnd: {
            SubscribeToVideoEnd(sendResponse);
            break;
        }
        default:
            throw new Error('Message not declared');
    }
};

// chrome.runtime.sendMessage({ mess: request });

chrome.runtime.onMessage.addListener(messageHandler);
