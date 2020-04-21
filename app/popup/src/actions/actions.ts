import { Action,
    ActionResultActionTypeEnum,
    ActionResultEnum,
    AppActionTypeEnum,
    ApplicationModeEnum,
    convertSecondsToTimeFormat,
    initialTime,
    RootReducerState } from 'common';

export const changeAppState = (newState: ApplicationModeEnum): any =>
     (dispatch, getState) => {
         const state = getState() as RootReducerState;

         dispatch({
            type: AppActionTypeEnum.ChangeApplicationState,
            data: {
                newInputValue: newState === ApplicationModeEnum.VideoPlayer ?
                    convertSecondsToTimeFormat(state.activeTabReducer.videoDuration, true) : initialTime,
                newState,
            },
        });
    };

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
