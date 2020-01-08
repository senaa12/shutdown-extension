// simplification of chrome types
export declare type MessageSender = chrome.runtime.MessageSender;
export declare type Tab = chrome.tabs.Tab;

// popup => content-script messaging
export interface ContentScriptMessage {
    type: ContentScriptMessageTypeEnum;
    data?: any;
}

export enum ContentScriptMessageTypeEnum {
    SubscribeToVideoEnd,
    RemoveSubscription,
    CheckVideoAvailability,
    TriggerAlert,
    CheckNativeApp,
}

// content-script => bacground messaging
export interface BackgroundMessage {
    type: BackgroundMessageTypeEnum;
    data: any;
}

export enum BackgroundMessageTypeEnum {
    ShutdownComputer,
    CheckNativeApp,
}

// webext-redux sender type
export interface Sender  {
    id: string;
    tab: Tab;
    url?: string;
}
