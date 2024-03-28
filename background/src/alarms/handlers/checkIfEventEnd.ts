import { SportsApiRequestType, calculateSeconds } from "common";
import { store } from "../..";
import sportsApiFetcher from "../../utilities/sportsApiFetcher/sportsApiFetcher";
import { shutddownCommandWithIconChange } from "./shutdownEvent";
import { AlarmTypeEnum } from "../models";
import { scheduleShutdownAction } from "../../utilities/actions";

const sportApiDelayInSeconds = 20;
const oneSecInMs = 1000;
const pingApiIfSportEventIsFinished = 7;

export const checkEventEndShutdown = async() => {
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
                chrome.alarms.create(AlarmTypeEnum.Shutdown, { when: new Date().getTime() + (seconds * oneSecInMs) })
                scheduleShutdownAction(true);
            }
        } else {
            shutddownCommandWithIconChange();
        }
    } else {
        chrome.alarms.create(AlarmTypeEnum.CheckEventFinished, { when: new Date().getTime() + (pingApiIfSportEventIsFinished * oneSecInMs) })
    }
};