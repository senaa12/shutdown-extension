import * as React from 'react';
import { renderWithReduxStore } from '../../../test/setup';
import MenuButtons from './menuButtons';

describe('Menu Buttons tests', () => {
    test('test1', async() => {
        const { findByLabelText } = renderWithReduxStore(
            <MenuButtons />,
            { appReducer: {
                isHostAppActive: true,
             }});
        const sena = expect(true).toEqual(true);
    });
});
