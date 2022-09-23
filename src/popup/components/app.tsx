import { ApplicationModeEnum, extensionWillNotWork, links, RootReducerState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ActionButtons from './actionButtons/actionButtons';
import { ActiveTabReaderInjectedProps } from './activeTabReader/activeTabReader';
import CountdownComponent from './countdownComponent/countdownComponent';
import Header from './header/header';
import MenuButtons from './menuButtons/menuButtons';
import SportEndingsComponent from './sportEndingsComponent/sportEndingsComponent';
import TimerComponent from './timerComponent/timerComponent';
import VideoEndComponent from './videoEndComponent/videoEndComponent';

import './app.scss';

export interface AppStateProps {
    selectedAppMode: ApplicationModeEnum;
    isHostAppActive: boolean;
}
declare type AppProps = AppStateProps & ActiveTabReaderInjectedProps;

const mapStateToProps = (state: RootReducerState, ownProps: ActiveTabReaderInjectedProps): AppProps => {
    return {
        selectedAppMode: state.appReducer.selectedApplicationMode,
        isHostAppActive: state.appReducer.isHostAppActive,
    };
};

class App extends React.Component<AppProps> {
    constructor(props: AppProps) {
        super(props);
    }

    private readMoreAbout = () => window.open(links.FAQ, '_blank');

    private renderAppContentComponent = (content: React.ReactNode) => (
        <CSSTransition id={Math.round(Math.random() * 10000)} timeout={300} classNames={'shutdown-animation'}>
            <div className='app-content-component'>{content}</div>
        </CSSTransition>
    )

    public render() {
        const { selectedAppMode } = this.props;
        return(
            <>
                <Header />
                <MenuButtons />
                    <TransitionGroup className='app-content'>
                            {selectedAppMode === ApplicationModeEnum.VideoPlayer &&
                                this.renderAppContentComponent(<VideoEndComponent currentTabId={this.props.currentTabId} />)
                            }
                            {selectedAppMode === ApplicationModeEnum.Timer &&
                                this.renderAppContentComponent(<TimerComponent />)
                            }
                            {selectedAppMode === ApplicationModeEnum.Countdown &&
                                this.renderAppContentComponent(<CountdownComponent />)
                            }
                            {selectedAppMode === ApplicationModeEnum.SportEvent &&
                                this.renderAppContentComponent(<SportEndingsComponent />)
                            }
                    </TransitionGroup>
                <ActionButtons currentTabId={this.props.currentTabId} />
                {!this.props.isHostAppActive &&
                    <div className='extension-will-not-work'>{extensionWillNotWork(this.readMoreAbout)}</div>}
            </>
        );
    }
}

export default connect(mapStateToProps)(App);
