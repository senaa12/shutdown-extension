import { convertSecondsToTimeFormat, RootReducerState, TabState, videoPlayerStrings } from 'common';
import React from 'react';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import LoadingComponent from '../reusableComponents/loadingComponent';
import TimeDurationComponent from '../reusableComponents/timeDurationComponent';
import './videoEndShutdownComponent.scss';

interface VideoEndShutdownComponentState {
    tabTitle?: string;
    isDisabled: boolean;
    selectedTime: string;
}

interface ActiveTabID {
    activeTabId?: number;
}

interface VideoEndShutdownComponenStateProps {
    subscribedTab: number;
    selectedTime: string;
    timeChange(newTime: string): void;
}

declare type VideoEndShutdownComponentProps = ActiveTabID & TabState & VideoEndShutdownComponenStateProps;

const mapStateToProps = (state: RootReducerState, ownProps: ActiveTabID): Partial<VideoEndShutdownComponentProps> => {
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

const dispatchStateToProps = (dispatch: Dispatch): Partial<VideoEndShutdownComponentProps> => {
    return {
        timeChange: (newTime: string) => dispatch(changeTimeSelected(newTime)),
    };
};

// tslint:disable-next-line: max-line-length
class VideoEndShutdownComponent extends React.Component<VideoEndShutdownComponentProps, VideoEndShutdownComponentState> {
    constructor(props: VideoEndShutdownComponentProps) {
        super(props);
        this.state = {
            tabTitle: '',
            isDisabled: true,
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

    private renderContent = () => {
        const { activeTabId,
            documentHasVideoTag,
            documentHasIFrameTag,
            subscribedTab,
            waitingForFirstLoad } = this.props;
        let response;
        let isDisabledState = true;

        if (waitingForFirstLoad) {
            response = <LoadingComponent />;
        } else if (subscribedTab > 0) {
            // shutdown is monitored on this tab
            if (activeTabId === subscribedTab) {
                response = videoPlayerStrings.shutdownSubscribed.thisTab(`${this.props.selectedTime}/${convertSecondsToTimeFormat(this.props.videoDuration, true)}`);
            } else {
                // tslint:disable-next-line: max-line-length
                response = videoPlayerStrings.shutdownSubscribed.otherTab(this.navigateToSelectedTab, this.state.tabTitle);
            }
        } else if (documentHasVideoTag) {
            isDisabledState = false;
            response =
            <>
                <div>{videoPlayerStrings.videoAvailable}</div>
                <TimeDurationComponent
                    onChange={this.props.timeChange}
                    value={this.props.selectedTime}
                    isDisabled={this.state.isDisabled}
                    maxValue={convertSecondsToTimeFormat(this.props.videoDuration, true)}
                    fontSize={30}
                    labelPosition={'BOTTOM'}
                    labelClassname={'small-label'}
                    label={`Video will end at ${this.props.selectedTime}/${convertSecondsToTimeFormat(this.props.videoDuration, true)}`}
                />
            </>;
        } else if (documentHasIFrameTag) {
            response = videoPlayerStrings.iframeAvailable(this.navigateToIframeSource);
        } else {
            response =  videoPlayerStrings.notAvailable;
        }
        if (isDisabledState !== this.state.isDisabled) {
            this.setState({ isDisabled: isDisabledState });
        }
        return response;
    }

    public render() {
        return (
            <div className='video-end-component'>
                {this.renderContent()}
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(VideoEndShutdownComponent);
