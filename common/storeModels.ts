import { PlatformEnum } from './chromeApiModels';
import { SportApiMatchModel } from './sportApiModels';

export const isShutdownScheduledSelector = (state: RootReducerState) =>
    state.appReducer.shutdownEventScheduleData !== 0;

export interface RootReducerState {
    appReducer: AppReducerState;
    activeTabReducer: ActiveTabReducerState;
    actionsResultReducer: ActionsResultState;
    sportsModeReducer: SportsModeReducerState;
}

export interface AppReducerState {
    selectedApplicationMode: ApplicationModeEnum;
    isHostAppActive: boolean;
    /** -1  = represents if countdown, timer or sport is scheduled,
     * 0   = NO EVENT IS SCHEDULED,
     * >0  = represents tabID from scheduled event
     */
    shutdownEventScheduleData: number;
    /** shutdown function */
    shutdownEvent: any;
    inputSelectedTime: string;
    inputSelectedDateTimeString: string;
    platformType: PlatformEnum;
}

export interface SportsModeReducerState {
    addDelayToShutdown: boolean;
    selectedSportEventForShutdown?: SportApiMatchModel;
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
    SportEvent,
}

export enum ActionResultEnum {
    None,
    Scan,
    Canceled,
    Shutdown,
    WrongToken,
}
