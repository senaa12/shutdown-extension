import { ApplicationModeEnum, extensionWillNotWork, hostNotActive, links, RootReducerState, TabState } from 'common';
import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import { connect } from 'react-redux';

import ActionButtons from './actionButtons/actionButtons';
import { ActiveTabReaderInjectedProps } from './activeTabReader/activeTabReader';
import CountdownComponent from './countdownComponent/countdownComponent';
import Header from './header/header';
import MenuButtons from './menuButtons/menuButtons';
import TimerComponent from './timerComponent/timerComponent';
import VideoEndComponent from './videoEndComponent/videoEndComponent';

import './app.scss';

export interface AppStateProps {
    selectedAppMode: ApplicationModeEnum;
    isHostAppActive: boolean;
}
declare type AppContentStateProps = AppStateProps & ActiveTabReaderInjectedProps;
declare type AppContentProps = Partial<AppContentStateProps>;

const mapStateToProps = (state: RootReducerState, ownProps: ActiveTabReaderInjectedProps): AppContentStateProps => {
    return {
        selectedAppMode: state.appReducer.selectedApplicationMode,
        isHostAppActive: state.appReducer.isHostAppActive,
        ...ownProps,
    };
};
class App extends React.Component<AppContentProps> {
    constructor(props: AppContentProps) {
        super(props);
    }

    public renderAppContent = () => {
        switch (this.props.selectedAppMode) {
            case ApplicationModeEnum.VideoPlayer: {
                return <VideoEndComponent key={'first'} currentTabId={this.props.currentTabId} />;
            }
            case ApplicationModeEnum.Countdown: {
                return <CountdownComponent key={'second'} />;
            }
            default: {
                return <TimerComponent key={'third'} />;
            }
        }
    }

    private readMoreAbout = () => window.open(links.FAQ, '_blank');

    public render() {
        return(
            <>
                <Header />
                <MenuButtons />
                    <ReactCSSTransitionReplace
                        transitionName='cross-fade'
                        className='app-content'
                    >
                        {this.renderAppContent()}
                    </ReactCSSTransitionReplace>
                <ActionButtons currentTabId={this.props.currentTabId} />
                {!this.props.isHostAppActive &&
                    <div className='extension-will-not-work'>{extensionWillNotWork(this.readMoreAbout)}</div>}
            </>
        );
    }
}

export default connect(mapStateToProps)(App);
