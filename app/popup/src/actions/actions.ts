import { Action, ActionResultActionTypeEnum, ActionResultEnum, AppActionTypeEnum, ApplicationModeEnum } from 'common';

export const changeAppState = (newState: ApplicationModeEnum): Action => ({
        type: AppActionTypeEnum.ChangeApplicationState,
        data: newState,
});

export const changeTimeSelected = (newTime: string): Action =>  ({
    type: AppActionTypeEnum.ChangeSelectedTime,
    data: newTime,
});

export const changeSelectedDateTime = (newDate: Date) => ({
    type: AppActionTypeEnum.ChangeSelectedDateTime,
    data: newDate,
});

export const triggerActionResultTooltip = (newState: ActionResultEnum, mess?: React.ReactNode) => ({
    type: ActionResultActionTypeEnum.TriggerTooltip,
    data: {
        type: newState,
        message: mess,
    },
});
