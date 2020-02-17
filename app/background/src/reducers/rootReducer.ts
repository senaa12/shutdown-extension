import { combineReducers } from 'redux';

import { RootReducerState } from 'common';
import actionsResultReducer, { actionsResultInitialState } from './actionsResultReducer';
import activeTabReducer, { activeTabReducerInitialState } from './ActiveTabReducer';
import appReducer, { appReducerInitialState } from './appReducer';

export const rootReducerInitialState: RootReducerState = {
    appReducer: appReducerInitialState,
    activeTabReducer: activeTabReducerInitialState,
    actionsResultReducer: actionsResultInitialState,
};

export default combineReducers({
    appReducer,
    activeTabReducer,
    actionsResultReducer,
});
