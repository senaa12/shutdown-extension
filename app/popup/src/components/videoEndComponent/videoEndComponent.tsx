import {
    ActiveTabReducerState,
    convertSecondsToTimeFormat,
    links,
    RootReducerState,
    TabStateEnum,
    videoPlayerStrings } from 'common';
import React from 'react';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import { ActiveTabReaderInjectedProps } from '../activeTabReader/activeTabReader';
import LoadingComponent from '../reusableComponents/loadingComponent';
import TimeDurationComponent from '../reusableComponents/timeDurationComponent';
import './VideoEndComponent.scss';

interface VideoEndComponentState {
    selectedTime: string;
    tabTitle?: string;
}

interface VideoEndShutdownComponenStateProps {
    subscribedTab: number;
    selectedTime: string;
    timeChange(newTime: string): void;
}

declare type VideoEndComponentProps = ActiveTabReducerState
    & VideoEndShutdownComponenStateProps
    & ActiveTabReaderInjectedProps;

// tslint:disable-next-line: max-line-length
const mapStateToProps = (state: RootReducerState, ownProps: ActiveTabReaderInjectedProps): Partial<VideoEndComponentProps> => {
    return {
        ...state.activeTabReducer,
        subscribedTab: state.appReducer.shutdownEventScheduleData,
        selectedTime: state.appReducer.inputSelectedTime,
    };
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
            state,
            iframeSource,
            subscribedTab,
            currentTabId,
        } = this.props;
        const shutdownIsSubscribed = subscribedTab > 0;

        if (shutdownIsSubscribed) {
            if (currentTabId === subscribedTab) {
                return videoPlayerStrings.shutdownSubscribed.thisTab(`${this.props.selectedTime}/${convertSecondsToTimeFormat(this.props.videoDuration, true)}`);
            } else {
                return videoPlayerStrings.shutdownSubscribed.otherTab(this.navigateToSelectedTab, this.state.tabTitle);
            }
        }

        switch (state) {
            case TabStateEnum.PageContainsVideoTag: {
                return (
                    <>
                        <div>{videoPlayerStrings.videoAvailable}</div>
                        <TimeDurationComponent
                            onChange={this.props.timeChange}
                            value={this.props.selectedTime}
                            maxValue={convertSecondsToTimeFormat(this.props.videoDuration, true)}
                            fontSize={30}
                            style={{ marginTop: 10 }}
                            labelPosition={'BOTTOM'}
                            labelClassname={'small-label'}
                            label={`Computer will shut down at ${this.props.selectedTime}/${convertSecondsToTimeFormat(this.props.videoDuration, true)}`}
                        />
                    </>
                );
            }
            case TabStateEnum.PageContainsIFrameTag : {
                return (
                    <>
                        {videoPlayerStrings.iframeAvailable(this.navigateToIframeSource, iframeSource)}
                        <div className={'read-more'}>{videoPlayerStrings.readMore(this.readMoreAbout)}</div>
                    </>
                );
            }
            case TabStateEnum.WaitingForFirstLoad: {
                return <LoadingComponent />;
            }
            default: {
                return videoPlayerStrings.notAvailable;
            }
        }
    }

    public render() {
        return (
            <div className='flex-column video-end-component'>
                {this.renderContent()}
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(VideoEndComponent);
