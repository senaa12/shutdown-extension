export interface RootReducerState {
    appReducer: AppReducerState;
    openTabsReducer: OpenTabsReducerState;
}

export interface AppReducerState {
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
