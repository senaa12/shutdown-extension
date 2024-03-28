import {
    ActionResultEnum,
    actionResultsStrings,
    ApplicationModeEnum,
    calculateSeconds,
    SportsApiRequestType} from 'common';
import { store } from '..';
import { changeIcon,
    removeScheduleShutdownAction, scheduleShutdownAction,
    triggerTooltipWithMessage } from './actions';
import sportsApiFetcher from './sportsApiFetcher/sportsApiFetcher';
import { AlarmTypeEnum } from '../alarms/models';

const oneSecInMs = 1000;
const pingApiIfSportEventIsFinished = 7;

export const removeShutdownEvent = () => {
    changeIcon(false);
    removeScheduleShutdownAction();
    triggerTooltipWithMessage(actionResultsStrings.cancel.canceled, ActionResultEnum.Canceled);
};

export const countdownShutdownEvent = () => {
    const time = store.getState().appReducer.inputSelectedTime;
    if (calculateSeconds(time) < 60) {
        triggerTooltipWithMessage(actionResultsStrings.shutdown.failedCountdown, ActionResultEnum.Shutdown);
    } else {
        chrome.alarms.create(AlarmTypeEnum.Countdown, { when: new Date().getTime() + 1000})

        scheduleShutdownAction(true);
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
        chrome.alarms.create(AlarmTypeEnum.Shutdown, { when: selectedTime.getTime()  });

        const tooltipTime = new Date(selectedTime.getTime() - (60 * oneSecInMs));
        if (tooltipTime.getTime() > new Date().getTime()) {
            chrome.alarms.create(AlarmTypeEnum.ShutdownTooltip, { when: tooltipTime.getTime() })
        }

        scheduleShutdownAction(true);
        triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);
        changeIcon(true);
    }
};

export const sportEventShutdown = async() => {
    const match = store.getState().sportsModeReducer.selectedSportEventForShutdown!;
    const isCompleted = await sportsApiFetcher.Fetch({
        type: SportsApiRequestType.IsEventCompleted,
        data: match,
    });
    if (isCompleted) {
        triggerTooltipWithMessage(actionResultsStrings.shutdown.failedCountdown, ActionResultEnum.Shutdown);
        return;
    }

    chrome.alarms.create(AlarmTypeEnum.CheckEventFinished, { when: new Date().getTime() + (pingApiIfSportEventIsFinished * oneSecInMs) })
    scheduleShutdownAction(true);
    triggerTooltipWithMessage(actionResultsStrings.shutdown.success, ActionResultEnum.Shutdown);
    changeIcon(true);
};
