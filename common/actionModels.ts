import { Tab } from './chromeApiModels';

// webext-redux sender type
export interface Sender  {
    id: string;
    tab: Tab;
    url?: string;
}

export interface Action {
    type: ActionTypeEnum;
    data?: any;
    _sender?: Sender; // DO NOT TOUCH
}

export enum AppActionTypeEnum {
    ScheduleShutdown = '@App/SCHEDULE_SHUTDOWN',
    RemoveScheduledShutdown = '@App/REMOVE_SCHEDULED_SHUTDOWN',
    ChangeApplicationState = '@App/CHANGE_APP_STATE',
    ChangeSelectedTime = '@App/CHANGE_SELECTED_TIME',
    ChangeSelectedDateTime = '@App/CHANGE_SELECTED_DATE_TIME',
    IsHostActiveCheck = '@App/IS_HOST_ACTIVE',
    SetPlatformType = '@App/SET_PLATFORM_TYPE',
    ToggleShutdownIfVideoChanges = '@App/TOGGLE_SHUTDOWN_IF_VIDEO_CHANGES',
}

export enum SportsModeActionTypeEnum {
    SetSelectedSportEventForShutdown = '@Sport/SET_SELECTED_SPORT_EVENT_FOR_SHUTDOWN',
    SetAddDelayToShutdownCheckbox = '@Sport/SET_ADD_DELAY_TO_SHUTDOWN',
    SetIsSportDialogOpen = '@Sport/SET_IS_SPORT_DIALOG_OPEN',
}

export enum ActionResultActionTypeEnum {
    TriggerTooltip = '@ActionResult/TRIGGER_TOOLTIP',
}

export enum TabsActionTypeEnum {
    SetTabState = '@Tabs/SET_TAB_STATE',
    ClearAndSetWaitingForFirstLoad = '@Tabs/CLEAR_AND_SET_WAITING',
}

export declare type ActionTypeEnum = TabsActionTypeEnum
        | ActionResultActionTypeEnum
        | AppActionTypeEnum
        | SportsModeActionTypeEnum;
export type CallbackFunction = (data?: any) => void;

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
