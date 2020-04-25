import { render } from '@testing-library/react';
import { RecursivePartial, RootReducerState } from 'common';
import * as React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createStore from 'store-config';

export const renderWithReduxStore = (comp: React.ReactElement, state: RecursivePartial<RootReducerState> = {}) => {
    const store = createStore(state, [thunk]);

    return {
        ...render(<Provider store={store}>{comp}</Provider>),
        store,
    };
};
