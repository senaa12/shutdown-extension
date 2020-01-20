import { ApplicationModeEnum, hostNotActive, links, RootReducerState, TabState } from 'common';
import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import { connect } from 'react-redux';

import ActionButtons from './actionButtons/actionButtons';
import CountdownComponent from './countdownComponent/countdownComponent';
import Header from './header/header';
import MenuButtons from './menuButtons/menuButtons';
import RevealContentAnimationWrapper from './revealContentAnimationWrapper/revealContentAnimationWrapper';
import TimerComponent from './timerComponent/timerComponent';
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
class App extends React.Component<AppContentProps> {
    constructor(props: AppContentProps) {
        super(props);
    }

    public renderAppContent = () => {
        switch (this.props.selectedAppMode) {
            case ApplicationModeEnum.VideoPlayer: {
                return <VideoEndShutdownComponent key={'first'} activeTabId={this.props.currentTabId}/>;
            }
            case ApplicationModeEnum.Countdown: {
                return <CountdownComponent key={'second'} />;
            }
            default: {
                return <TimerComponent key={'third'} />;
            }
        }
    }

    private openNativeDownloadLink = () => chrome.tabs.update({ url: links.nativeWin });

    public render() {
        return(
            <>
                <RevealContentAnimationWrapper shouldShowChildren={!this.props.isHostAppActive}>
                    {hostNotActive(this.openNativeDownloadLink)}
                </RevealContentAnimationWrapper>
                <Header />
                <MenuButtons />
                    <ReactCSSTransitionReplace
                        transitionName='cross-fade'
                        className='app-content'
                    >
                        {this.renderAppContent()}
                    </ReactCSSTransitionReplace>
                <ActionButtons currentTabId={this.props.currentTabId} />
            </>
        );
    }
}

export default connect(mapStateToProps)(App);
