import * as React from 'react';
import { connect } from 'react-redux';

import { RootReducerState, ShutdownSubscriptionReducerState } from 'common';
import './app.scss';
import SubscriptionMessage from './subscriptionMessage/subscriptionMessage';
import Tile from './tile/tile';

interface AppProps {
    subscriptionProps: ShutdownSubscriptionReducerState;
}

const mapStateToProps = (state: RootReducerState): AppProps => {
    return {
        subscriptionProps: state.shutdownSubscriptionReducer,
    };
};

class App extends React.Component<AppProps, any> {
    constructor(props: AppProps) {
        super(props);
    }

    public render() {
        console.log(this.props.subscriptionProps);
        return(
            <div className='app'>
                <Tile />
                <SubscriptionMessage />
            </div>
        );
    }

}

export default connect(mapStateToProps)(App);
