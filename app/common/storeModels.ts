export interface RootReducerState {
    appReducer: AppReducerState;
    openTabsReducer: OpenTabsReducerState;
    actionsResultReducer: ActionsResultState;
}

export interface AppReducerState {
    selectedApplicationMode: ApplicationModeEnum;
    isHostAppActive: boolean;
    // tslint:disable-next-line: max-line-length
    /** -1 represents if countdown is scheduled, 0 if no event is scheduled, and >0 represents tabID from scheduled event */
    isShutdownEventScheduled: number;
    /** shutdown function */
    shutdownEvent: any;
    inputSelectedTime: string;
}

export interface ActionsResultState {
    actionResultTooltip: ActionResultEnum;
    actionResultTooltipMessage: React.ReactNode;
}

export interface OpenTabsReducerState {
    [key: number]: TabState;
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
