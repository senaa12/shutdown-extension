import { Sender } from './chromeApiModels';

export interface Action {
    type: ActionTypeEnum;
    data?: any;
    _sender?: Sender; // DO NOT TOUCH
}

export enum ActionTypeEnum {
    SubscribedToVideoEnd = '@App/SUBSCRIBE_TO_VIDEO_END',
    RemoveVideoEndSubscription = '@App/REMOVE_VIDEO_SUBSCRIPTON',
    ChangeApplicationState = '@App/CHANGE_APP_STATE',

    CheckTabVideoAvailability = '@Tabs/CHECK_VIDEO_AVAILABILITY',
    UpdateTabInformation = '@Tabs/UPDATE_VIDEO_AVAILABILITY',
    RemoveTab = '@Tabs/REMOVE_TAB',
}

export type CallbackFunction = (data: any) => void;
