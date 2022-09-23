import { BackgroundMessageTypeEnum, CallbackFunction, ChromeApiMessage,
    getStorageLocal, MessageSender, setStorageLocal } from 'common';
import { changeIcon, triggerOneMinuteWarningNotification } from './utilities/actions';
import { connecToNativeApp, shutdownCommand } from './utilities/nativeCommunication';
import { countdownShutdownEvent, removeShutdownEvent, sportEventShutdown, timerShutdown } from './utilities/shutdown';
import sportsApiFetcher from './utilities/sportsApiFetcher/sportsApiFetcher';

const messageHandler = (
    request: ChromeApiMessage,
    sender: MessageSender,
    sendResponse: CallbackFunction) => {
        switch (request.type) {
            case BackgroundMessageTypeEnum.LoadStorageLocal: {
                getStorageLocal(request.data)
                    .then(sendResponse)
                    .catch(console.error);

                return true;
            }
            case BackgroundMessageTypeEnum.SetStorageLocal: {
                setStorageLocal(request.data.type, request.data.data)
                    .then(sendResponse)
                    .catch(console.error);

                return true;
            }
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
                sportsApiFetcher.Fetch(request.data).then(sendResponse);

                // return true keeps channel open and waits when sendResponse will be called (async actions)
                return true;
            }
        }
};

export default messageHandler;
