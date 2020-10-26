import {
    ActionResultEnum,
    actionResultsStrings,
    ApplicationModeEnum,
    calculateSeconds,
    convertSecondsToTimeFormat,
    SportsApiRequestType} from 'common';
import { store } from '..';
import { changeIcon, changeSelectedTimeAction,
    removeScheduleShutdownAction, scheduleShutdownAction,
    triggerOneMinuteWarningNotification, triggerTooltipWithMessage } from './actions';
import { shutdownCommand } from './nativeCommunication';
import sportsApiFetcher from './sportsApiFetcher/sportsApiFetcher';

const oneSecInMs = 1000;
const sportApiDelayInSeconds = 20;

const shutddownCommandWithIconChange = () => {
    removeShutdownEvent();
    shutdownCommand();
};

export const removeShutdownEvent = () => {
    const event = store.getState().appReducer.shutdownEvent;
    const appMode = store.getState().appReducer.selectedApplicationMode;
    if (appMode === ApplicationModeEnum.Timer) {
        clearTimeout(event);
    } else if (appMode === ApplicationModeEnum.Countdown) {
        clearInterval(event);
    }

    changeIcon(false);
    removeScheduleShutdownAction();
    triggerTooltipWithMessage(actionResultsStrings.cancel.canceled, ActionResultEnum.Canceled);
};

export const countdownShutdownEvent = () => {
    const countdownInterval = () => {
        const seconds = calculateSeconds(store.getState().appReducer.inputSelectedTime) - 1;
        if (seconds < 1) {
            shutddownCommandWithIconChange();
        } else {
            if (seconds === 60) {
                triggerOneMinuteWarningNotification();
            }
            changeSelectedTimeAction(convertSecondsToTimeFormat(seconds, true));
        }
    };

    const time = store.getState().appReducer.inputSelectedTime;
    if (calculateSeconds(time) < 60) {
        triggerTooltipWithMessage(actionResultsStrings.shutdown.failedCountdown, ActionResultEnum.Shutdown);
    } else {
        const func = setInterval(countdownInterval, oneSecInMs);
        scheduleShutdownAction(true, func);
        triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);
        changeIcon(true);
    }
};

export const timerShutdown = () => {
    const selectedTime = new Date(store.getState().appReducer.inputSelectedDateTimeString);
    const currentTime = new Date();

    if (currentTime > selectedTime) {
        triggerTooltipWithMessage(actionResultsStrings.shutdown.failedTimer, ActionResultEnum.Shutdown);
    } else {
        const triggerTooltipAndScheduleShutdown = () => {
            triggerOneMinuteWarningNotification();
            const diff = selectedTime.getTime() - currentTime.getTime();
            const shutFunc = setTimeout(
                shutddownCommandWithIconChange, diff > (60 * oneSecInMs) ? (60 * oneSecInMs) : diff,
            );
            scheduleShutdownAction(true, shutFunc);
        };

        const delay = selectedTime.getTime() - currentTime.getTime();
        const func = setTimeout(triggerTooltipAndScheduleShutdown, delay - (60 + oneSecInMs));
        scheduleShutdownAction(true, func);
        triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);
        changeIcon(true);
    }
};

export const sportEventShutdown = () => {
    const checkEventEndShutdown = async() => {
        const isStillScheduled = store.getState().appReducer.shutdownEventScheduleData;
        if (!isStillScheduled) {
            return;
        }

        const selectedMatch = store.getState().sportsModeReducer.selectedSportEventForShutdown!;
        const isEventCompleted = await sportsApiFetcher.Fetch({
            type: SportsApiRequestType.IsEventCompleted,
            data: selectedMatch,
        });

        if (isEventCompleted) {
            const additionalDelay = store.getState().sportsModeReducer.addDelayToShutdown;

            if (additionalDelay) {
                let seconds = calculateSeconds(store.getState().appReducer.inputSelectedTime);
                seconds -= sportApiDelayInSeconds;

                if (seconds < 0) {
                    shutddownCommandWithIconChange();
                } else {
                    const delayFunc = setTimeout(shutddownCommandWithIconChange, seconds * oneSecInMs);
                    scheduleShutdownAction(true, delayFunc);
                }
            } else {
                shutddownCommandWithIconChange();
            }
        } else {
            setTimeout(checkEventEndShutdown, 10 * oneSecInMs);
        }
    };

    // set interval does not work good with async function
    const func = setTimeout(checkEventEndShutdown, 10 * oneSecInMs);
    scheduleShutdownAction(true, func);
    triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);
    changeIcon(true);
};
