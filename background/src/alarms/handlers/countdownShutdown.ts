import { calculateSeconds, convertSecondsToTimeFormat } from "common";
import { store } from "../..";
import { shutddownCommandWithIconChange } from "./shutdownEvent";
import { changeSelectedTimeAction, triggerOneMinuteWarningNotification } from "../../utilities/actions";
import { AlarmTypeEnum } from "../models";

export const countdownInterval = () => {
    const seconds = calculateSeconds(store.getState().appReducer.inputSelectedTime) - 1;
    if (seconds < 1) {
        shutddownCommandWithIconChange();
    } else {
        if (seconds === 60) {
            triggerOneMinuteWarningNotification();
        }
        changeSelectedTimeAction(convertSecondsToTimeFormat(seconds, true));
    }

    chrome.alarms.create(AlarmTypeEnum.Countdown, { when: new Date().getTime() + 1000 })
};