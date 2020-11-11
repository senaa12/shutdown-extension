import {  BackgroundMessageTypeEnum,
    ContentScriptMessageTypeEnum,
    isShutdownScheduledSelector,
    RootReducerState } from 'common';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, Store } from 'webext-redux';
import { toggleIsSportDialogOpen } from './actions/actions';
import ActiveTabReader from './components/activeTabReader/activeTabReader';
import App from './components/app';
import Snowfall, { SnowfallDensity } from './components/snowfall/snowfall';
import communicationManager from './utilities/communicationManager';

import './index.scss';

const store = new Store();
const storeWithMiddleware = applyMiddleware(store, ...[thunk]);

storeWithMiddleware.ready().then(() => {
    store.dispatch(toggleIsSportDialogOpen(false));

    communicationManager.sendMessageToBackgroundPage({
        type: BackgroundMessageTypeEnum.CheckNativeApp,
    });

    const isShutdownScheduled = isShutdownScheduledSelector(store.getState() as RootReducerState);
    if (!isShutdownScheduled) {
        communicationManager.sendMessageToActiveTab({
            type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
        });
    }

    ReactDOM.render(
        <Provider store={store}>
            <Snowfall density={SnowfallDensity.Least} />
            <ActiveTabReader>
                <App />
            </ActiveTabReader>
        </Provider>,
        document.getElementById('app'),
    );
});
