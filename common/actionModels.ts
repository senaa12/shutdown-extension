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
}

export enum ActionResultActionTypeEnum {
    TriggerTooltip = '@ActionResult/TRIGGER_TOOLTIP',
}

export enum TabsActionTypeEnum {
    SetTabState = '@Tabs/SET_TAB_STATE',
    ClearAndSetWaitingForFirstLoad = '@Tabs/CLEAR_AND_SET_WAITING',
}

export declare type ActionTypeEnum = TabsActionTypeEnum | ActionResultActionTypeEnum | AppActionTypeEnum;
export type CallbackFunction = (data?: any) => void;

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
