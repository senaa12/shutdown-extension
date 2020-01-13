import { BackgroundMessage, BackgroundMessageTypeEnum, CallbackFunction, MessageSender } from 'common';
import { countdownShutdownEvent, removeCountdownShutdownEvent } from './utilities/countdownShutdown';
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
            case BackgroundMessageTypeEnum.CountdownToShutdown: {
                countdownShutdownEvent();
                break;
            }
            case BackgroundMessageTypeEnum.RemoveCountdownToShutdown: {
                removeCountdownShutdownEvent();
                break;
            }
            default: {
                throw new Error('message handler not defined');
            }
        }

};

export default messageHandler;
