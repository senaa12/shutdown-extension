import { Action, ActionResultActionTypeEnum, ActionResultEnum, AppActionTypeEnum, ApplicationModeEnum } from 'common';

export const changeAppState = (newState: ApplicationModeEnum): Action => ({
        type: AppActionTypeEnum.ChangeApplicationState,
        data: newState,
});

export const changeTimeSelected = (newTime: string): Action =>  ({
    type: AppActionTypeEnum.ChangeSelectedTime,
    data: newTime,
});

export const changeSelectedDate = (newDate: string) => ({
    type: AppActionTypeEnum.ChangeSelectedDate,
    data: newDate,
});

export const triggerActionResultTooltip = (newState: ActionResultEnum, mess?: React.ReactNode) => ({
    type: ActionResultActionTypeEnum.TriggerTooltip,
    data: {
        type: newState,
        message: mess,
    },
});
