import { Action, SportsModeActionTypeEnum, SportsModeReducerState } from 'common';

export const sportsModerReducerInitialState: SportsModeReducerState = {
    isSportsApiEnabled: false,
    addDelayToShutdown: false,
    selectedSportEventForShutdown: undefined,
};

export default (state = sportsModerReducerInitialState, action: Action): SportsModeReducerState => {
    switch (action.type) {
        case SportsModeActionTypeEnum.SetIsSportsApiEnabledParameter: {
            return {
                ...state,
                isSportsApiEnabled: action.data,
            };
        }
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
        default: {
            return state;
        }
    }
};
