import { BackgroundMessage, BackgroundMessageTypeEnum, CallbackFunction, MessageSender } from 'common';
import { changeIcon } from './utilities/changeIcon';
import { connecToNativeApp, shutdownCommand } from './utilities/nativeCommunication';
import { countdownShutdownEvent, removeShutdownEvent, timerShutdown } from './utilities/shutdown';

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
                removeShutdownEvent();
                break;
            }
            case BackgroundMessageTypeEnum.TimerShutdown: {
                timerShutdown();
                break;
            }
            case BackgroundMessageTypeEnum.ChangeIcon: {
                changeIcon(request.data);
                break;
            }
            default: {
                // if not redux store action throw error
                if (request.type !== 'chromex.dispatch') {
                    throw new Error('Message handler must be defined');
                }

            }
        }
};

export default messageHandler;
