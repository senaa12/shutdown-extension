import { Action, ActionResultEnum, ActionTypeEnum, ApplicationModeEnum } from 'common';

export const changeAppState = (newState: ApplicationModeEnum): Action => ({
        type: ActionTypeEnum.ChangeApplicationState,
        data: newState,
});

export const changeTimeSelected = (newTime: string): Action =>  ({
    type: ActionTypeEnum.ChangeSelectedTime,
    data: newTime,
});

export const triggerActionResultTooltip = (newState: ActionResultEnum) => ({
    type: ActionTypeEnum.TriggerTooltip,
    data: newState,
});
