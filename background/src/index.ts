import { getStorageLocal, SportsApiFetchRequestType, SportsModeActionTypeEnum, StorageLocalKeysEnum } from 'common';
import { wrapStore } from 'webext-redux';
import messageHandler from './messageHandler';
import createStore, { getMiddleware } from './reducers/store';
import { changeIcon, checkSystem } from './utilities/actions';
import { connecToNativeApp } from './utilities/nativeCommunication';
import sportsApiFetcher, { TestRequestResponse } from './utilities/sportsApiFetcher';
import { onHistoryStateUpdated, onRemoved, onUpdated } from './utilities/tabsManipulation';

const isProduction = process.env.PRODUCTION !== undefined ? JSON.parse(process.env.PRODUCTION) : false;

const middleWare = getMiddleware(isProduction);
export const store = createStore({}, middleWare);

export default wrapStore(store);

chrome.tabs.onUpdated.addListener(onUpdated);
chrome.tabs.onRemoved.addListener(onRemoved);

getStorageLocal<string>(StorageLocalKeysEnum.SportsApiToken).then((token) =>
    sportsApiFetcher.Fetch(SportsApiFetchRequestType.Test, token)
        .then((fetchResult: TestRequestResponse) =>
            store.dispatch({
                type: SportsModeActionTypeEnum.SetIsSportsApiEnabledParameter,
                data: (fetchResult as TestRequestResponse).success,
            }),
        ).catch((fetchResult: TestRequestResponse) => {
            // if throttled => token is okey
            if (fetchResult.errorMsg?.includes('request limit')) {
                store.dispatch({
                    type: SportsModeActionTypeEnum.SetIsSportsApiEnabledParameter,
                    data: true,
                });
            }

            console.error(fetchResult);
        }),
).catch(console.error);

// browser back button
chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdated);

chrome.runtime.onMessage.addListener(messageHandler);

connecToNativeApp();

checkSystem();

changeIcon();
