import {
    ActionResultEnum,
    actionResultsStrings,
    ApplicationModeEnum,
    calculateSeconds,
    convertSecondsToTimeFormat } from 'common';
import { store } from '..';
import { changeIcon, changeSelectedTimeAction,
    removeScheduleShutdownAction, scheduleShutdownAction,
    triggerOneMinuteWarningNotification, triggerTooltipWithMessage } from './actions';
import { shutdownCommand } from './nativeCommunication';

const shutddownCommandWithIconChange = () => {
    removeShutdownEvent();
    shutdownCommand();
};

export const removeShutdownEvent = () => {
    const event = store.getState().appReducer.shutdownEvent;
    const appMode = store.getState().appReducer.selectedApplicationMode;
    if (appMode === ApplicationModeEnum.Timer) {
        clearTimeout(event);
    } else {
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
        const func = setInterval(countdownInterval, 1000);
        scheduleShutdownAction(true, func);
        triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);
        changeIcon(true);
    }
};

export const timerShutdown = () => {
    const selectedTime = new Date(store.getState().appReducer.inputSelectedDateTime);
    const currentTime = new Date();

    if (currentTime > selectedTime) {
        triggerTooltipWithMessage(actionResultsStrings.shutdown.failedTimer, ActionResultEnum.Shutdown);
    } else {
        const triggerTooltipAndScheduleShutdown = () => {
            triggerOneMinuteWarningNotification();
            const shutFunc = setTimeout(shutddownCommandWithIconChange, 60000);
            scheduleShutdownAction(true, shutFunc);
        };

        const delay = selectedTime.getTime() - currentTime.getTime();
        const func = setTimeout(triggerTooltipAndScheduleShutdown, delay - 60000);
        scheduleShutdownAction(true, func);
        triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);
        changeIcon(true);
    }
};
