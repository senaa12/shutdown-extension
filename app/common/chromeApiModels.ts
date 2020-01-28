// simplification of chrome types
export declare type MessageSender = chrome.runtime.MessageSender;
export declare type Tab = chrome.tabs.Tab;

// => content-script messaging
export interface ContentScriptMessage {
    type: ContentScriptMessageTypeEnum;
    data?: any;
}

export enum ContentScriptMessageTypeEnum {
    SubscribeToVideoEnd,
    RemoveVideoScheduledShutdown,
    CheckVideoAvailability,
    TriggerAlert,
}

// => bacground messaging
export interface BackgroundMessage {
    type: BackgroundMessageTypeEnum;
    data?: any;
}

export enum BackgroundMessageTypeEnum {
    ShutdownComputer,
    CheckNativeApp,
    CountdownToShutdown,
    RemoveCountdownToShutdown,
    TimerShutdown,
    ChangeIcon,
}

// webext-redux sender type
export interface Sender  {
    id: string;
    tab: Tab;
    url?: string;
}
