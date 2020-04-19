// simplification of chrome types
export declare type MessageSender = chrome.runtime.MessageSender;
export declare type Tab = chrome.tabs.Tab;

// => content-script messaging
export enum ContentScriptMessageTypeEnum {
    SubscribeToVideoEnd,
    CheckVideoAvailability,
    RemoveVideoShutdownEvent,
}

// => bacground messaging
export enum BackgroundMessageTypeEnum {
    ShutdownComputer,
    CheckNativeApp,
    CountdownToShutdown,
    TimerShutdown,
    RemoveShutdownEvent,
    ChangeIcon,
    TriggerNotification,
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

export const commandsPerPlatform = {
    win: 'shutdown /s /f /t 0',
};
