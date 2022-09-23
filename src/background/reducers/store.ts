import { REACT_APP_REDUX_PORT, RecursivePartial, RootReducerState, STORAGE_CACHE_VERSION } from 'common';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import actionsResultReducer, { actionsResultInitialState } from './actionsResultReducer';
import activeTabReducer, { activeTabReducerInitialState } from './activeTabReducer';
import appReducer, { appReducerInitialState } from './appReducer';
import sportsModeReducer, { sportsModerReducerInitialState } from './sportsModeReducer';
import thunk from 'redux-thunk';
import { Store, wrapStore } from '@roma-sav/webext-redux';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

// tslint:disable-next-line: no-var-requires
const merge = require('deepmerge');

export const rootReducerInitialState: RootReducerState = {
    appReducer: appReducerInitialState,
    activeTabReducer: activeTabReducerInitialState,
    actionsResultReducer: actionsResultInitialState,
    sportsModeReducer: sportsModerReducerInitialState,
};

export const rootReducer = combineReducers({
    appReducer,
    activeTabReducer,
    actionsResultReducer,
    sportsModeReducer,
});

export const getMiddleware = (isProd: boolean) => {
    return !isProd ? [logger, thunk] : [thunk];
};

export const buildFrom = (initialStateOverride: RecursivePartial<RootReducerState> = {}) => {
    const initialState: RootReducerState = merge(rootReducerInitialState, initialStateOverride);
    const middleware = getMiddleware(isProduction);

    return createStore(
        rootReducer,
        initialState,
        !!middleware ? applyMiddleware(...middleware) : undefined,
    );
};
  
const initializeWrappedStore = async(initialState: RecursivePartial<RootReducerState> = {}): Promise<Store<any, any>> => {
    // let initialStateObject;
    // if (!Object.keys(initialState)?.length) {
    //     const stateFromStorage = await chrome.storage.local.get(STORAGE_CACHE_VERSION);
    //     initialStateObject = stateFromStorage[STORAGE_CACHE_VERSION];
    // }
    // else {
    //     initialStateObject = initialState;
    // }

	const store = buildFrom(initialState);

	wrapStore(store, { portName: REACT_APP_REDUX_PORT });

	await chrome.storage.local.clear();

	await chrome.storage.local.set({ [STORAGE_CACHE_VERSION]: store.getState() });
	store.subscribe(async () => {
		await chrome.storage.local.set({ [STORAGE_CACHE_VERSION]: store.getState() });
	});

    return store as any;
}

export default initializeWrappedStore