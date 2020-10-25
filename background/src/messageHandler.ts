import { BackgroundMessageTypeEnum, CallbackFunction, ChromeApiMessage, MessageSender } from 'common';
import { changeIcon, triggerOneMinuteWarningNotification } from './utilities/actions';
import { connecToNativeApp, shutdownCommand } from './utilities/nativeCommunication';
import { countdownShutdownEvent, removeShutdownEvent, sportEventShutdown, timerShutdown } from './utilities/shutdown';
import sportsApiFetcher from './utilities/sportsApiFetcher';

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
            case BackgroundMessageTypeEnum.SportEventShutdown: {
                sportEventShutdown();
                break;
            }
            case BackgroundMessageTypeEnum.TriggerNotification: {
                triggerOneMinuteWarningNotification();
                break;
            }
            case BackgroundMessageTypeEnum.SportsApiFetch: {
                sportsApiFetcher
                    .Fetch(request.data?.requestType ?? request.data, request.data?.token)
                    .then(sendResponse);

                // return true keeps channel open and waits when sendResponse will be called (async actions)
                return true;
            }
        }
};

export default messageHandler;
