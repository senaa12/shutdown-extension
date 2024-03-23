import { triggerOneMinuteWarningNotification } from "../utilities/actions";
import { checkEventEndShutdown } from "./handlers/checkIfEventEnd";
import { handleClearNotification, isClearNotificationAlarm } from "./handlers/clearNotifications";
import { countdownInterval } from "./handlers/countdownShutdown";
import { AlarmTypeEnum } from "./models"
import { shutddownCommandWithIconChange } from "./handlers/shutdownEvent";

export const alarmHandler = (alarm: chrome.alarms.Alarm) => {
    if (isClearNotificationAlarm(alarm.name)) {
        handleClearNotification(alarm.name);
        return;
    }

    switch(alarm.name) {
        case AlarmTypeEnum.Shutdown:
            shutddownCommandWithIconChange();
            break;
        case AlarmTypeEnum.Countdown:
            countdownInterval();
            break;
        case AlarmTypeEnum.CheckEventFinished:
            checkEventEndShutdown();
            break;
        case AlarmTypeEnum.ShutdownTooltip:
            triggerOneMinuteWarningNotification();
            break;
        default: 
            console.error(`No handler for ${alarm.name}`)
    }
}