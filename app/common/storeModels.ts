export interface RootReducerState {
    appReducer: AppReducerState;
    openTabsReducer: OpenTabsReducerState;
}

export interface AppReducerState {
    isHostAppActive: boolean;
    isEventSubscibed: boolean;
    tabId: number;
    selectedApplicationMode: ApplicationModeEnum;
    selectedTime: string;
    event: undefined | any;
    actionResultTooltip: ActionResultEnum;
    actionResultTooltipMessage: React.ReactNode;
}

export interface OpenTabsReducerState {
    tabs: { [key: number]: TabState };
}

export interface TabState {
    documentHasVideoTag: boolean;
    videoDuration: number;
    documentHasIFrameTag: boolean;
    iframeSource: string;
    waitingForFirstLoad: boolean;
}

export enum ApplicationModeEnum {
    VideoPlayer,
    Countdown,
}

export enum ActionResultEnum {
    None,
    Scan,
    Canceled,
    Shutdown,
}
