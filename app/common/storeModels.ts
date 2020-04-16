export const isShutdownScheduledSelector = (state: RootReducerState) =>
    state.appReducer.shutdownEventScheduleData !== 0;

export interface RootReducerState {
    appReducer: AppReducerState;
    activeTabReducer: ActiveTabReducerState;
    actionsResultReducer: ActionsResultState;
}

export interface AppReducerState {
    selectedApplicationMode: ApplicationModeEnum;
    isHostAppActive: boolean;
    // tslint:disable-next-line: max-line-length
    /** -1 represents if countdown is scheduled, 0 if no event is scheduled, and >0 represents tabID from scheduled event */
    shutdownEventScheduleData: number;
    /** shutdown function */
    shutdownEvent: any;
    inputSelectedTime: string;
    inputSelectedDateTime: Date;
}

export interface ActionsResultState {
    actionResultTooltip: ActionResultEnum;
    actionResultTooltipMessage: React.ReactNode;
}

export interface TabState {
    state: TabStateEnum;
    videoDuration?: number;
    iframeSource?: string;
}

export interface ActiveTabReducerState extends TabState {
    tabID: number;
}

export enum TabStateEnum {
    WaitingForFirstLoad,
    PageContainsVideoTag,
    PageContainsIFrameTag,
    PageCannotUseThisExtension,
}

export enum ApplicationModeEnum {
    VideoPlayer,
    Countdown,
    Timer,
}

export enum ActionResultEnum {
    None,
    Scan,
    Canceled,
    Shutdown,
}
