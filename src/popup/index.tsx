import {  BackgroundMessageTypeEnum,
    ContentScriptMessageTypeEnum,
    isShutdownScheduledSelector,
    REACT_APP_REDUX_PORT,
    RootReducerState } from 'common';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { toggleIsSportDialogOpen } from './actions/actions';
import ActiveTabReader from './components/activeTabReader/activeTabReader';
import App from './components/app';
import Snowfall, { SnowfallDensity } from './components/snowfall/snowfall';
import communicationManager from './utilities/communicationManager';
import { Store } from '@roma-sav/webext-redux';

import './index.scss';

const proxyStore = new Store({
	portName: REACT_APP_REDUX_PORT
});

proxyStore.ready().then(() => {
    proxyStore.dispatch(toggleIsSportDialogOpen(false));

    communicationManager.sendMessageToBackgroundPage({
        type: BackgroundMessageTypeEnum.CheckNativeApp,
    });

    const isShutdownScheduled = isShutdownScheduledSelector(proxyStore.getState() as RootReducerState);
    if (!isShutdownScheduled) {
        communicationManager.sendMessageToActiveTab({
            type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
        });
    }

    ReactDOM.render(
        <Provider store={proxyStore}>
            <Snowfall density={SnowfallDensity.Least} />
            <ActiveTabReader>
                <App />
            </ActiveTabReader>
        </Provider>,
        document.getElementById('app'),
    );
});

export default proxyStore;
