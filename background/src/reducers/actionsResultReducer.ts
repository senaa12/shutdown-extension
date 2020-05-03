import { Action, ActionResultActionTypeEnum, ActionResultEnum, ActionsResultState } from 'common';

export const actionsResultInitialState: ActionsResultState = {
    actionResultTooltip: ActionResultEnum.None,
    actionResultTooltipMessage: '',
};

export default (state = actionsResultInitialState, action: Action) => {
    switch (action.type) {
        case ActionResultActionTypeEnum.TriggerTooltip: {
            return {
                ...state,
                actionResultTooltip: action.data.type,
                actionResultTooltipMessage: action.data?.message ?? state.actionResultTooltipMessage,
            };
        }
        default: {
            return state;
        }
    }
};
