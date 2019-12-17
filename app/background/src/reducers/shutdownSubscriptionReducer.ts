import { Action, ActionTypeEnum } from 'common';
import { ShutdownSubscriptionReducerState } from 'common/storeModels';

export const shutdownSubscriptionReducerInitialState: ShutdownSubscriptionReducerState = {
    isEventSubscibed: false,
    tabId: 0,
};

export default (state = shutdownSubscriptionReducerInitialState, action: Action): ShutdownSubscriptionReducerState => {
    switch (action.type) {
        case ActionTypeEnum.SubscribedToVideoEnd: {
            if (!action.data?.success) {
                return state;
            }

            return {
                ...state,
                isEventSubscibed: action.data.success,
                tabId:  action._sender?.tab.id ? action._sender.tab.id : -1,
            };
        }
        default:
            return state;
    }
};
