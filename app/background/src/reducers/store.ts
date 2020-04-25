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

export const getMiddleware = (isProd: boolean) => {
    return !isProd ? [logger] : undefined;
};

export default (initialStateOverride: RecursivePartial<RootReducerState> = {}, middleware?: Array<any>) => {
    const initialState: RootReducerState = merge(rootReducerInitialState, initialStateOverride);

    return createStore(
        rootReducer,
        initialState,
        !!middleware ? applyMiddleware(...middleware) : undefined,
    );
};
