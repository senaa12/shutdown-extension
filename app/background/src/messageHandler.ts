import { BackgroundMessage, BackgroundMessageTypeEnum, CallbackFunction, MessageSender } from 'common';
import nativeCommunicationService from './nativeCommunicationService';

const messageHandler = (
    request: BackgroundMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
        switch (request.type) {
            case BackgroundMessageTypeEnum.ShutdownComputer: {
                nativeCommunicationService.shutdownCommand(sendResponse);
                break;
            }
            default: {
                throw new Error('message handler not defined');
            }
        }

};

export default messageHandler;
