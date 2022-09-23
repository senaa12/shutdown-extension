import { Action,
    ActionResultActionTypeEnum,
    ActionResultEnum,
    AppActionTypeEnum,
    ApplicationModeEnum,
    SportApiMatchModel,
    SportsModeActionTypeEnum } from 'common';

export const changeAppState = (newState: ApplicationModeEnum, newInputValue?: string): any => ({
    type: AppActionTypeEnum.ChangeApplicationState,
    data: {
        newInputValue,
        newState
    },
});

export const changeTimeSelected = (newTime: string): Action =>  ({
    type: AppActionTypeEnum.ChangeSelectedTime,
    data: newTime,
});

export const toggleShutdownIfVideoChanges = (val: boolean): Action => ({
    type: AppActionTypeEnum.ToggleShutdownIfVideoChanges,
    data: val,
});

export const changeSelectedDateTime = (newDate: Date) => ({
    type: AppActionTypeEnum.ChangeSelectedDateTime,
    data: newDate,
});

export const setSelectedSportEventForShutdown = (event?: SportApiMatchModel) => ({
    type: SportsModeActionTypeEnum.SetSelectedSportEventForShutdown,
    data: event,
});

export const setAddDelayToSportShutdown = (value: boolean) => ({
    type: SportsModeActionTypeEnum.SetAddDelayToShutdownCheckbox,
    data: value,
});

export const toggleIsSportDialogOpen = (open: boolean) => ({
    type: SportsModeActionTypeEnum.SetIsSportDialogOpen,
    data: open,
});

export const triggerActionResultTooltip = (newState: ActionResultEnum, mess?: React.ReactNode) => ({
    type: ActionResultActionTypeEnum.TriggerTooltip,
    data: {
        type: newState,
        message: mess,
    },
});
