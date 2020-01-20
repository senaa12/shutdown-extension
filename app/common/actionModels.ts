import { Sender } from './chromeApiModels';

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
}

export enum ActionResultActionTypeEnum {
    TriggerTooltip = '@ActionResult/TRIGGER_TOOLTIP',
}

export enum TabsActionTypeEnum {
    CheckTabVideoAvailability = '@Tabs/CHECK_VIDEO_AVAILABILITY',
    UpdateTabInformation = '@Tabs/UPDATE_VIDEO_AVAILABILITY',
    RemoveTab = '@Tabs/REMOVE_TAB',
    SetWaitingForFirstLoad = '@Tabs/WAITING_FOR_FIRST_LOAD',
}

export declare type ActionTypeEnum = TabsActionTypeEnum | ActionResultActionTypeEnum | AppActionTypeEnum;
export type CallbackFunction = (data?: any) => void;
