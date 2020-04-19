import { ApplicationModeEnum,
    initialDateTime,
    initialTime,
    isShutdownScheduledSelector,
    RootReducerState,
    TabStateEnum } from 'common';

export const isShutdownButtonDisabledCheck = (state: RootReducerState) => {
    if (!state.appReducer.isHostAppActive) {
        return true;
    }

    switch (state.appReducer.selectedApplicationMode) {
        case ApplicationModeEnum.VideoPlayer: {
            // !(should not be disabled when shutdown not scheduled and page contains video tag)
            return !(!isShutdownScheduledSelector(state)
                && state.activeTabReducer.state === TabStateEnum.PageContainsVideoTag);
        }
        case ApplicationModeEnum.Countdown: {
            // !(shutdown is not scheduled and input value is different from initial)
            return !(!isShutdownScheduledSelector(state) &&
                state.appReducer.inputSelectedTime !== initialTime);
        }
        case ApplicationModeEnum.Timer: {
            // !(shutdown is not scheduled and input value is different from initial and scheduled date is in future)
            return !(!isShutdownScheduledSelector(state) &&
                state.appReducer.inputSelectedDateTimeString !== initialDateTime() &&
                new Date(state.appReducer.inputSelectedDateTimeString).getTime() > new Date().getTime());
        }
        default: {
            throw new Error(`Shutdown disability check is not defined for ${state.appReducer.selectedApplicationMode}`);
        }
    }
};

export const isCancelButtonDisabledCheck = (state: RootReducerState) => {
    if (!state.appReducer.isHostAppActive) {
        return true;
    }

    switch (state.appReducer.selectedApplicationMode) {
        case ApplicationModeEnum.VideoPlayer: {
            // !(shutdown is scheduled and current tab is the one where video is)
            return !(isShutdownScheduledSelector(state)
                && state.activeTabReducer.tabID === state.appReducer.shutdownEventScheduleData);
        }
        case ApplicationModeEnum.Countdown:
        case ApplicationModeEnum.Timer: {
            return !isShutdownScheduledSelector(state);
        }
        default: {
            throw new Error(`Cancel disability check is not defined for ${state.appReducer.selectedApplicationMode}`);
        }
    }
};
