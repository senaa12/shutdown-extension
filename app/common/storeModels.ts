export interface RootReducerState {
    shutdownSubscriptionReducer: ShutdownSubscriptionReducerState;
    openTabsReducer: OpenTabsReducerState;
}

export interface ShutdownSubscriptionReducerState {
    isEventSubscibed: boolean;
    tabId: number;
}

export interface OpenTabsReducerState {
    tabs: { [key: number]: TabState };
}

export interface TabState {
    documentHasVideoTag: boolean;
    documentHasIFrameTag: boolean;
    iframeSource: string;
}
