import { combineReducers } from 'redux';

import { RootReducerState } from 'common';
import actionsResultReducer, { actionsResultInitialState } from './actionsResultReducer';
import appReducer, { appReducerInitialState } from './appReducer';
import openTabsReducer, { openTabsReducerInitialState } from './openTabsReducer';

export const rootReducerInitialState: RootReducerState = {
    appReducer: appReducerInitialState,
    openTabsReducer: openTabsReducerInitialState,
    actionsResultReducer: actionsResultInitialState,
};

export default combineReducers({
    appReducer,
    openTabsReducer,
    actionsResultReducer,
});
