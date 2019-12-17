import { Sender } from './chromeApiModels';

export interface Action {
    type: ActionTypeEnum;
    data?: any;
    _sender?: Sender; // DO NOT TOUCH
}

export enum ActionTypeEnum {
    SubscribedToVideoEnd = '@App/SUBSCRIBE_TO_VIDEO_END',

    CheckTabVideoAvailability = '@Tabs/CHECK_VIDEO_AVAILABILITY',
}

export type CallbackFunction = (data: any) => void;
