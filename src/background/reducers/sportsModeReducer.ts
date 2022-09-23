import { Action, SportsModeActionTypeEnum, SportsModeReducerState } from 'common';

export const sportsModerReducerInitialState: SportsModeReducerState = {
    addDelayToShutdown: false,
    selectedSportEventForShutdown: undefined,
    isSelectSportDialogOpen: false
};

export default (state = sportsModerReducerInitialState, action: Action): SportsModeReducerState => {
    switch (action.type) {
        case SportsModeActionTypeEnum.SetSelectedSportEventForShutdown: {
            return {
                ...state,
                selectedSportEventForShutdown: action.data,
            };
        }
        case SportsModeActionTypeEnum.SetAddDelayToShutdownCheckbox: {
            return {
                ...state,
                addDelayToShutdown: action.data,
            };
        }
        case SportsModeActionTypeEnum.SetIsSportDialogOpen: {
            return {
                ...state, 
                isSelectSportDialogOpen: action.data
            }
        }
        default: {
            return state;
        }
    }
};
