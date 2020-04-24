import { RecursivePartial, RootReducerState } from 'common';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import actionsResultReducer, { actionsResultInitialState } from './actionsResultReducer';
import activeTabReducer, { activeTabReducerInitialState } from './ActiveTabReducer';
import appReducer, { appReducerInitialState } from './appReducer';

// tslint:disable-next-line: no-var-requires
const merge = require('deepmerge');

export const rootReducerInitialState: RootReducerState = {
    appReducer: appReducerInitialState,
    activeTabReducer: activeTabReducerInitialState,
    actionsResultReducer: actionsResultInitialState,
};

export const rootReducer = combineReducers({
    appReducer,
    activeTabReducer,
    actionsResultReducer,
});

export default (initialStateOverride: RecursivePartial<RootReducerState> = {}, isProduction?: boolean) => {
    const initialState: RootReducerState = merge(rootReducerInitialState, initialStateOverride);

    return createStore(
        rootReducer,
        initialState,
        !isProduction ? applyMiddleware(logger) : undefined,
    );
};
