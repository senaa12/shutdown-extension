// simplification of chrome types
export declare type MessageSender = chrome.runtime.MessageSender;
export declare type Tab = chrome.tabs.Tab;

// => content-script messaging
export enum ContentScriptMessageTypeEnum {
    SubscribeToVideoEnd = 'SUBSCRIBE_TO_VIDEO_END',
    CheckVideoAvailability = 'CHECK_VIDEO_AVAILABILITY',
    RemoveVideoShutdownEvent = 'REMOVE_VIDEO_SHUTDOWN_EVENT',
    FocusIframe = 'FOCUS_IFRAME',
    BlurIframe = 'BLUR_IFRAME'
}

// => bacground messaging
export enum BackgroundMessageTypeEnum {
    ShutdownComputer = 'SHUTDOWN_COMPUTER',
    CheckNativeApp = 'CHECK_NATIVE_APP',
    CountdownToShutdown = 'COUNTDOWN_TO_SHUTDOWN',
    TimerShutdown = 'TIMER_SHUTDOWN',
    RemoveShutdownEvent = 'REMOVE_SHUTDOWN_EVENT',
    ChangeIcon = 'CHANGE_ICON',
    TriggerNotification = 'TRIGGER_NOTIFICATION',
    SportsApiFetch = 'SPORTS_API_FETCH',
    SportEventShutdown = 'SPORT_EVENT_SHUTDOWN',
    LoadStorageLocal = 'LOAD_STORAGE_LOCAL',
    SetStorageLocal = 'SET_STORAGE_LOCAL',
}

export declare type ChromeApiMessageTypeEnum = ContentScriptMessageTypeEnum | BackgroundMessageTypeEnum;
export interface ChromeApiMessage {
    type: ChromeApiMessageTypeEnum;
    data?: any;
}

export enum PlatformEnum {
    mac = 'mac',
    win = 'win',
    android = 'android',
    cros = 'cros',
    linux = 'linux',
    openbsd = 'openbsd',
}
