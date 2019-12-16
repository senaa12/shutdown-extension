import { combineReducers } from 'redux';

import { RootReducerState } from 'common';
import shutdownSubscriptionReducer, { shutdownSubscriptionReducerInitialState } from './shutdownSubscriptionReducer';

export const rootReducerInitialState: RootReducerState = {
    shutdownSubscriptionReducer: shutdownSubscriptionReducerInitialState,
};

export default combineReducers({
    shutdownSubscriptionReducer,
});
