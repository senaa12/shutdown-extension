import { combineReducers } from 'redux';

import { RootReducerState } from 'common';
import openTabsReducer, { openTabsReducerInitialState } from './openTabsReducer';
import shutdownSubscriptionReducer, { shutdownSubscriptionReducerInitialState } from './shutdownSubscriptionReducer';

export const rootReducerInitialState: RootReducerState = {
    shutdownSubscriptionReducer: shutdownSubscriptionReducerInitialState,
    openTabsReducer: openTabsReducerInitialState,
};

export default combineReducers({
    shutdownSubscriptionReducer,
    openTabsReducer,
});
