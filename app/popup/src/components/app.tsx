import { ApplicationModeEnum, hostNotActive, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import ActionButtons from './actionButtons/actionButtons';
import Header from './header/header';
import MenuButtons from './menuButtons/menuButtons';
import VideoEndShutdownComponent from './videoEndShutdownComponent/videoEndShutdownComponent';

import './app.scss';

export interface AppOwnProps {
    currentTabId?: number;
}

export interface AppStateProps {
    selectedAppMode: ApplicationModeEnum;
    isHostAppActive: boolean;
}

declare type AppContentProps = AppOwnProps & TabState & AppStateProps;

const mapStateToProps = (state: RootReducerState, ownProps: AppOwnProps): Partial<AppContentProps> => {
    return {
        ...ownProps,
        selectedAppMode: state.appReducer.selectedApplicationMode,
        isHostAppActive: state.appReducer.isHostAppActive,
    };
};
class App extends React.Component<AppContentProps, any> {
    constructor(props: AppContentProps) {
        super(props);
    }

    public render() {
        return(
            <>
                <Header />
                <MenuButtons />
                <div className='app-content'>
                    {this.props.isHostAppActive ?
                            (this.props.selectedAppMode === ApplicationModeEnum.VideoPlayer ?
                                <VideoEndShutdownComponent activeTabId={this.props.currentTabId}/> :
                                <div>countdown</div> ) :
                            <div className='inactive-host-message'>{hostNotActive()}</div>}
                </div>
                <ActionButtons currentTabId={this.props.currentTabId} />
            </>
        );
    }
}

export default connect(mapStateToProps)(App);
