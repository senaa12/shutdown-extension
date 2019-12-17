import { RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import VideoEndShutdownComponent from './videoEndShutdownComponent/videoEndShutdownComponent';

export interface AppOwnProps {
    currentTabId?: number;
}

declare type AppContentProps = AppOwnProps & TabState;

const mapStateToProps = (state: RootReducerState, ownProps: AppOwnProps): Partial<AppContentProps> => {
    return ownProps;
};
class App extends React.Component<AppContentProps, any> {
    constructor(props: AppContentProps) {
        super(props);
    }

    public render() {
        return(
            <div>
                <VideoEndShutdownComponent activeTabId={this.props.currentTabId}/>
            </div>
        );
    }
}

export default connect(mapStateToProps)(App);
