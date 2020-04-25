import { fireEvent } from '@testing-library/react';
import * as React from 'react';
import { renderWithReduxStore } from '../../../test/setup';
import StateBuilder from '../../../test/stateBuilder';
import MenuButtons from './menuButtons';

const setup = (isShutdownScheduled?: boolean) => {
    let buildState = new StateBuilder().create();
    if (isShutdownScheduled) {
        buildState = buildState.withVideoPlayerEventScheduled();
    }

    return renderWithReduxStore(
        <MenuButtons />,
        buildState.getState(),
    );
};

describe('Menu Buttons tests', () => {
    test('Switching between states', async() => {
        const { findByTestId } = setup();
        const state = await findByTestId('Video Player');
        const newState = await findByTestId('Countdown');

        expect(state.className.includes('selected')).toBe(true);
        expect(newState.className.includes('selected')).not.toBe(true);

        fireEvent.click(newState);

        const countdown = await findByTestId('Countdown');
        expect(countdown.className.includes('selected')).toBe(true);
        expect(state.className.includes('selected')).not.toBe(true);
    });

    test('Shutdown scheduled => clicks need to be disabled', async() => {
        const { findByTestId } = setup(true);
        const selectedState = await findByTestId('Video Player');
        const wantedState = await findByTestId('Countdown');

        expect(selectedState.className.includes('selected')).toBe(true);

        fireEvent.click(wantedState);

        expect(selectedState.className.includes('selected')).toBe(true);
    });
});
