import {  ContentScriptMessage, ContentScriptMessageTypeEnum } from 'common';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import ActiveTabReader from './components/activeTabReader/activeTabReader';
import App from './components/app';
import messanger from './utilities/contentScriptMessaging';

import './index.scss';

const store = new Store();

store.ready().then(() => {
    const isHostActive = store.getState().appReducer.isHostAppActive;
    if (!isHostActive) {
        const message: ContentScriptMessage = {
            type: ContentScriptMessageTypeEnum.CheckNativeApp,
        };
        messanger.sendMessageToActiveTab(message);
    }

    ReactDOM.render(
        <Provider store={store}>
            <ActiveTabReader>
                <App />
            </ActiveTabReader>
        </Provider>,
        document.getElementById('app'),
    );
});
