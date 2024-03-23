
const nameBase = 'clear-notification-'
export const isClearNotificationAlarm = (alarmName: string) => alarmName.includes(nameBase);
export const generateClearNotificationsAlarmName = (notificationId: string) => `${nameBase}${notificationId}`
export const getNotificationId = (alarmName: string) => alarmName.replace(nameBase, '');

export const handleClearNotification = (alarmName: string) => {
    chrome.notifications.clear(getNotificationId(alarmName));
}