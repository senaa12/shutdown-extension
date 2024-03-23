import { ActionResultActionTypeEnum, ActionResultEnum, AppActionTypeEnum } from 'common';
import { store } from '..';
import { generateClearNotificationsAlarmName } from '../alarms/handlers/clearNotifications';

/* #region Store actions */
export const triggerTooltipWithMessage = (respMessage: string, action: ActionResultEnum) => {
    store.dispatch({
        type: ActionResultActionTypeEnum.TriggerTooltip,
        data: {
            type: action,
            message: respMessage,
        },
    });
};

export const changeSelectedTimeAction = (newVal: string | undefined) => {
    store.dispatch({
        type: AppActionTypeEnum.ChangeSelectedTime,
        data: newVal,
    });
};

export const scheduleShutdownAction = (isActionSuccess: boolean) => {
    store.dispatch({
        type: AppActionTypeEnum.ScheduleShutdown,
        data: {
            success: isActionSuccess,
        },
    });
};

export const removeScheduleShutdownAction = () => {
    store.dispatch({
        type: AppActionTypeEnum.RemoveScheduledShutdown,
    });
};

export const setPlatformType = (type: string) => {
    store.dispatch({
        type: AppActionTypeEnum.SetPlatformType,
        data: type,
    });
};
/* #endregion */

/* #region  Chrome actions */
export const changeIcon = (shutdownIcon: boolean = false) => {
    if (shutdownIcon) {
        chrome.action?.setIcon({ path: '/icon-shutdown.png' });
    } else {
        chrome.action?.setIcon({ path: '/icon.png' });
    }
};

export const checkSystem = () => {
    const callBack = (details: chrome.runtime.PlatformInfo) => {
        setPlatformType(details.os);
    };
    chrome.runtime.getPlatformInfo(callBack);
};

export const triggerOneMinuteWarningNotification = () => {
    chrome.notifications.create('one-minute-warning',
        {
            title: 'Auto Shutdown Extension',
            message: 'Computer will shut down in 1 minute',
            type: 'basic',
            iconUrl: 'logo-128.png',
            isClickable: false,
        },
        (notificationId: string) => {
            chrome.alarms.create(generateClearNotificationsAlarmName(notificationId), { when: new Date().getTime() + 2500 });
        },
    );
};
/* #endregion */
