import { convertSecondsToTimeFormat, links, PageStateEnum, RootReducerState, TabState, videoPlayerStrings } from 'common';
import React from 'react';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import LoadingComponent from '../reusableComponents/loadingComponent';
import TimeDurationComponent from '../reusableComponents/timeDurationComponent';
import './VideoEndComponent.scss';

interface VideoEndComponentState {
    selectedTime: string;
    tabTitle?: string;
}

interface ActiveTabID {
    activeTabId?: number;
}

interface VideoEndShutdownComponenStateProps {
    subscribedTab: number;
    selectedTime: string;
    timeChange(newTime: string): void;
}

declare type VideoEndComponentProps = ActiveTabID & TabState & VideoEndShutdownComponenStateProps;

const mapStateToProps = (state: RootReducerState, ownProps: ActiveTabID): Partial<VideoEndComponentProps> => {
    if (ownProps.activeTabId) {
        return {
            ...ownProps,
            ...state.openTabsReducer[ownProps.activeTabId],
            subscribedTab: state.appReducer.isShutdownEventScheduled,
            selectedTime: state.appReducer.inputSelectedTime,
        };
    }

    return ownProps;
};

const dispatchStateToProps = (dispatch: Dispatch): Partial<VideoEndComponentProps> => {
    return {
        timeChange: (newTime: string) => dispatch(changeTimeSelected(newTime)),
    };
};

class VideoEndComponent extends React.Component<VideoEndComponentProps, VideoEndComponentState> {
    constructor(props: VideoEndComponentProps) {
        super(props);
        this.state = {
            tabTitle: '',
            selectedTime: '00:00:00',
        };
    }

    public componentDidMount() {
        if (this.props.subscribedTab) {
            this.setTabTitle();
        }
    }

    private setTabTitle = () =>
        chrome.tabs.get(this.props.subscribedTab, (tabs) => this.setState({ tabTitle: tabs.title }))
    private navigateToSelectedTab = () => chrome.tabs.update(this.props.subscribedTab, { active: true });
    private navigateToIframeSource = () => chrome.tabs.update({ url: this.props.iframeSource });
    private readMoreAbout = () => window.open(links.FAQ, '_blank');

    private renderContent = () => {
        const {
            activeTabId,
            state,
            iframeSource,
            subscribedTab,
        } = this.props;
        const shutdownIsSubscribed = subscribedTab > 0;

        if (state === PageStateEnum.WaitingForFirstLoad) {
            return <LoadingComponent />;
        }

        if (shutdownIsSubscribed) {
            if (activeTabId === subscribedTab) {
                return videoPlayerStrings.shutdownSubscribed.thisTab(`${this.props.selectedTime}/${convertSecondsToTimeFormat(this.props.videoDuration, true)}`);
            } else {
                return videoPlayerStrings.shutdownSubscribed.otherTab(this.navigateToSelectedTab, this.state.tabTitle);
            }
        }

        switch (state) {
            case PageStateEnum.PageContainsVideoTag: {
                return (
                    <>
                        <div>{videoPlayerStrings.videoAvailable}</div>
                        <TimeDurationComponent
                            onChange={this.props.timeChange}
                            value={this.props.selectedTime}
                            maxValue={convertSecondsToTimeFormat(this.props.videoDuration, true)}
                            fontSize={30}
                            labelPosition={'BOTTOM'}
                            labelClassname={'small-label'}
                            label={`Video will end at ${this.props.selectedTime}/${convertSecondsToTimeFormat(this.props.videoDuration, true)}`}
                        />
                    </>
                );
            }
            case PageStateEnum.PageContainsIFrameTag : {
                return (
                    <>
                        {videoPlayerStrings.iframeAvailable(this.navigateToIframeSource, iframeSource)}
                        <div className={'read-more'}>
                            If you want to know why do you need to navigate to IFrame and much more, you should
                            open our <span className='link' onClick={this.readMoreAbout}>FAQ document</span>.
                        </div>
                    </>
                );
            }
            default: {
                return videoPlayerStrings.notAvailable;
            }
        }
    }

    public render() {
        return (
            <div className='video-end-component'>
                {this.renderContent()}
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(VideoEndComponent);
