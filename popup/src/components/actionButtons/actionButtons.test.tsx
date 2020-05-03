import { fireEvent } from '@testing-library/react';
import {  ApplicationModeEnum, ContentScriptMessageTypeEnum, RootReducerState } from 'common';
import * as React from 'react';
import { renderWithReduxStore } from '../../../test/setup';
import StateBuilder from '../../../test/stateBuilder';
import { changeAppState, changeTimeSelected } from '../../actions/actions';
import ActionButtons from './actionButtons';

const setup = (state: RootReducerState, activeTab?: number) => {
    return renderWithReduxStore(
        <ActionButtons currentTabId={activeTab} />,
        state,
    );
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ActionButtons unit tests', () => {
    test('Shutdown option needs to be disabled when host is not active', async() => {
        const stateBuild = new StateBuilder().create().withVideoPlayerEventScheduled();
        const { getByTestId, store } = setup(stateBuild.getState(), 10);

        const shutdownButton = await getByTestId('Shutdown');
        expect(shutdownButton.className.includes('disabled')).toBe(true);

        store.dispatch(changeAppState(ApplicationModeEnum.Countdown));
        store.dispatch(changeTimeSelected('00:10:00'));

        expect(shutdownButton.className.includes('disabled')).toBe(true);
    });

    test('Set Video Player shutdown', async() => {
        const state = new StateBuilder().create().setHostActivity(true).withVideoPlayer();
        const { getByTestId } = setup(state.getState(), state.tabIdWithVideo);

        const shutdown = await getByTestId('Shutdown');
        fireEvent.click(shutdown);
        expect(chrome.tabs.sendMessage).toHaveBeenCalled();
        // chrome....mock.calls[0][1] are actually calling arguments
        // 0 is in this case TabID, 1 are args and 2 is callback function
        expect((chrome.tabs.sendMessage as any).mock.calls[0][1].type)
            .toBe(ContentScriptMessageTypeEnum.SubscribeToVideoEnd);
    });

    test('Video shutdown is scheduled on current tab, cancel is enabled and scan is disabled', async() => {
        const state = new StateBuilder().create().setHostActivity(true).withVideoPlayerEventScheduled();
        const { getByTestId } = setup(state.getState(), state.tabIdWithVideo);

        const cancel = await getByTestId('Cancel');
        fireEvent.click(cancel);
        expect(chrome.tabs.sendMessage).toHaveBeenCalled();

        jest.clearAllMocks();
        const scanNow = await getByTestId('Scan now');
        fireEvent.click(scanNow);
        expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
    });

    test('Video sutdown is scheduled on diff tab, cancel is disabled', async() => {
        const state = new StateBuilder().create().setHostActivity(true).withVideoPlayerEventScheduled();
        const { getByTestId } = setup(state.getState(), 1);

        const cancel = await getByTestId('Cancel');
        fireEvent.click(cancel);
        expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();

        const scanNow = await getByTestId('Scan now');
        fireEvent.click(scanNow);
        expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
    });
});
