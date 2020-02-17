import {  BackgroundMessageTypeEnum, ChromeApiMessage, ContentScriptMessageTypeEnum, TabStateEnum } from 'common';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import ActiveTabReader from './components/activeTabReader/activeTabReader';
import App from './components/app';
import communicationManager from './utilities/communicationManager';

import './index.scss';

const store = new Store();

store.ready().then(() => {
    const isHostActive = store.getState().appReducer.isHostAppActive;
    if (!isHostActive) {
        communicationManager.sendMessageToBackgroundPage({
            type: BackgroundMessageTypeEnum.CheckNativeApp,
        } as ChromeApiMessage);
    } else if (store.getState().activeTabReducer.state === TabStateEnum.WaitingForFirstLoad) {
        communicationManager.sendMessageToActiveTab({
            type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
        });
    }

    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app'),
    );
});
