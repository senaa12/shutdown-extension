import { combineReducers } from 'redux';

import { RootReducerState } from 'common';
import appReducer, { appReducerInitialState } from './appReducer';
import openTabsReducer, { openTabsReducerInitialState } from './openTabsReducer';

export const rootReducerInitialState: RootReducerState = {
    appReducer: appReducerInitialState,
    openTabsReducer: openTabsReducerInitialState,
};

export default combineReducers({
    appReducer,
    openTabsReducer,
});
