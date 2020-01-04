import { BackgroundMessage, BackgroundMessageTypeEnum, CallbackFunction, MessageSender } from 'common';
import { shutdownFunction } from './messageHandlers/shutdown';

const messageHandler = (
    request: BackgroundMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
        switch (request.type) {
            case BackgroundMessageTypeEnum.ShutdownComputer: {
                shutdownFunction(sendResponse);
                break;
            }
            default: {
                throw new Error('message handler not defined');
            }
        }

};

export default messageHandler;
