import { BackgroundMessageTypeEnum, CallbackFunction, ChromeApiMessage, MessageSender } from 'common';
import { changeIcon, triggerOneMinuteWarningNotification } from './utilities/actions';
import { connecToNativeApp, shutdownCommand } from './utilities/nativeCommunication';
import { countdownShutdownEvent, removeShutdownEvent, timerShutdown } from './utilities/shutdown';

const messageHandler = (
    request: ChromeApiMessage,
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
            case BackgroundMessageTypeEnum.TimerShutdown: {
                timerShutdown();
                break;
            }
            case BackgroundMessageTypeEnum.RemoveShutdownEvent: {
                removeShutdownEvent();
                break;
            }
            case BackgroundMessageTypeEnum.ChangeIcon: {
                changeIcon(request.data);
                break;
            }
            case BackgroundMessageTypeEnum.TriggerNotification: {
                triggerOneMinuteWarningNotification();
                break;
            }
        }
};

export default messageHandler;
