import { ApplicationModeEnum,
    initialTime,
    isShutdownScheduledSelector,
    RootReducerState,
    TabStateEnum } from 'common';

export const isShutdownButtonDisabledCheck = (state: RootReducerState) => {
    if (!state.appReducer.isHostAppActive || isShutdownScheduledSelector(state)) {
        return true;
    }

    switch (state.appReducer.selectedApplicationMode) {
        case ApplicationModeEnum.VideoPlayer: {
            // if does not contain video tag than it is disabled
            return state.activeTabReducer.state !== TabStateEnum.PageContainsVideoTag;
        }
        case ApplicationModeEnum.Countdown: {
            // if input is not changed than it is disabled
            return state.appReducer.inputSelectedTime === initialTime;
        }
        case ApplicationModeEnum.Timer: {
            // if input selected datetime is smaller than current time
            return new Date(state.appReducer.inputSelectedDateTimeString).getTime() < new Date().getTime();
        }
        case ApplicationModeEnum.SportEvent: {
            // if sport event is not selected and sport api is disabled
            return state.sportsModeReducer.selectedSportEventForShutdown === undefined
                || !state.sportsModeReducer.isSportsApiEnabled;
        }
        default: {
            throw new Error(`Shutdown disability check is not defined for ${state.appReducer.selectedApplicationMode}`);
        }
    }
};

export const isCancelButtonDisabledCheck = (state: RootReducerState, currentTabId?: number) => {
    if (!state.appReducer.isHostAppActive || !isShutdownScheduledSelector(state)) {
        return true;
    }

    switch (state.appReducer.selectedApplicationMode) {
        case ApplicationModeEnum.VideoPlayer: {
            // when scheduling video shutdown you need to be on the same tab where video is
            return currentTabId !== state.appReducer.shutdownEventScheduleData;
        }
        case ApplicationModeEnum.Countdown:
        case ApplicationModeEnum.Timer:
        case ApplicationModeEnum.SportEvent: {
            return false;
        }
        default: {
            throw new Error(`Cancel disability check is not defined for ${state.appReducer.selectedApplicationMode}`);
        }
    }
};
