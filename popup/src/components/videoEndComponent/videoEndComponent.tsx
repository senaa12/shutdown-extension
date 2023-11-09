import {
    ActiveTabReducerState,
    ChromeApiMessage,
    ContentScriptMessageTypeEnum,
    convertSecondsToTimeFormat,
    links,
    RootReducerState,
    TabStateEnum,
    videoPlayerStrings } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { changeTimeSelected, toggleShutdownIfVideoChanges } from '../../actions/actions';
import { ActiveTabReaderInjectedProps } from '../activeTabReader/activeTabReader';
import CheckBox from '../reusableComponents/checkboxComponent';
import LoadingComponent from '../reusableComponents/loadingComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';
import TimeDurationComponent from '../reusableComponents/timeDurationComponent';
import communicationManager from '../../utilities/communicationManager';
import './VideoEndComponent.scss';

interface VideoEndComponentState {
    selectedTime: string;
    tabTitle?: string;
}

interface VideoEndShutdownComponenStateProps {
    shutdownIfVideoChanges: boolean;
    subscribedTab: number;
    selectedTime: string;
    timeChange(newTime: string): void;
    toggleShutdownIfVideoChangesAction(val: boolean): void;
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
        shutdownIfVideoChanges: state.appReducer.shutdownIfVideoChanges,
    };
};

const dispatchStateToProps = (dispatch: Dispatch): Partial<VideoEndComponentProps> => {
    return {
        timeChange: (newTime: string) => dispatch(changeTimeSelected(newTime)),
        toggleShutdownIfVideoChangesAction: (val: boolean) => dispatch(toggleShutdownIfVideoChanges(val)),
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
    private navigateToIframeSource = () => chrome.tabs.update({ url: this.props.src });
    private readMoreAbout = () => window.open(links.FAQ, '_blank');
    private tooltipMessage = (
        <>
            Check this option if you want your computer to shutdown even if the video does not
            reach the selected time<br />(eg. Netflix plays the next episode)
        </>
    );

    private focusIframe = () => {
        communicationManager.sendMessageToActiveTab({
            type: ContentScriptMessageTypeEnum.FocusIframe,
        } as ChromeApiMessage);
    };
    
    private blurIframe = () => {
        communicationManager.sendMessageToActiveTab({
            type: ContentScriptMessageTypeEnum.BlurIframe,
        } as ChromeApiMessage);
    };

    private renderContent = () => {
        const {
            state,
            src,
            subscribedTab,
            currentTabId,
            shutdownIfVideoChanges,
            toggleShutdownIfVideoChangesAction,
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
                        <SimpleTooltipComponent
                            content={this.tooltipMessage}
                            tooltipClassname={'video-shutdown-tooltip'}
                        >
                            <CheckBox
                                checkboxClassname={'video-checkbox'}
                                checked={shutdownIfVideoChanges}
                                handleOnCheckboxChange={toggleShutdownIfVideoChangesAction}
                                label={'Shutdown if video changes'}
                            />
                        </SimpleTooltipComponent>
                    </>
                );
            }
            case TabStateEnum.PageContainsIFrameTag : {
                return (
                    <>
                        {videoPlayerStrings.iframeAvailable(this.navigateToIframeSource, src, this.focusIframe, this.blurIframe)}
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
