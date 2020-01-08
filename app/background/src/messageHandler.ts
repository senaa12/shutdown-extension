import { BackgroundMessage, BackgroundMessageTypeEnum, CallbackFunction, MessageSender } from 'common';
import { connecToNativeApp, shutdownCommand } from './utilities/nativeCommunication';

const messageHandler = (
    request: BackgroundMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
        switch (request.type) {
            case BackgroundMessageTypeEnum.ShutdownComputer: {
                shutdownCommand(sendResponse);
                break;
            }
            case BackgroundMessageTypeEnum.CheckNativeApp: {
                connecToNativeApp();
                break;
            }
            default: {
                throw new Error('message handler not defined');
            }
        }

};

export default messageHandler;
