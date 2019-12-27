import { ContentScriptMessage, ContentScriptMessageTypeEnum, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import messanger from '../../utilities/contentScriptMessaging';

import './videoEndShutdownComponent.scss';

interface Substitute {
    activeTabId?: number;
}

interface VideoEndShutdownComponentState {
    tabTitle?: string;
    isDisabled: boolean;
    selectedTime: string;
}

interface VideoEndShutdownComponenStateProps {
    subscribedTab: number;
}

declare type VideoEndShutdownComponentProps = Substitute & TabState & VideoEndShutdownComponenStateProps;

const mapStateToProps = (state: RootReducerState, ownProps: Substitute): Partial<VideoEndShutdownComponentProps> => {
    if (ownProps.activeTabId) {
        return {
            ...ownProps,
            ...state.openTabsReducer.tabs[ownProps.activeTabId],
            subscribedTab: state.appReducer.tabId,
        };
    }

    return ownProps;
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

    private subscribe = () => {
        const message: ContentScriptMessage = {
            type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
            data: {
                selectedTime: this.state.selectedTime,
            },
        };
        messanger.sendMessageToActiveTab(message);
    }

    private renderCheckAgainButton = () => {
        const onClick = () => {
            const message: ContentScriptMessage = {
                type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
            };
            messanger.sendMessageToActiveTab(message);
        };

        return <>{' '}<div className='link' onClick={onClick}>Check again</div></>;
    }

    private onTimeChange = (e) => {
        this.setState({ selectedTime: e.target.value });
    }

    private getMessage = () => {
        const { activeTabId, documentHasVideoTag, documentHasIFrameTag, subscribedTab } = this.props;
        let response;
        let isDisabledState = true;
        if (subscribedTab !== undefined && subscribedTab > 0 && activeTabId === subscribedTab) {
            response = <>After video on this web page ends, computer will shut down</>;
        } else if (subscribedTab !== undefined && subscribedTab > 0) {
            response =
                <>
                    <div>Computer will shut down after video ends at tab</div><br />
                    <div className='link' onClick={this.navigateToSelectedTab}>{this.state.tabTitle}</div>
                </>;
        } else if (documentHasVideoTag) {
            isDisabledState = false;
            response =  'Click subscribe shut down computer after video ends';
        } else if (documentHasIFrameTag) {
            response =
                <>
                    <div>
                        This web page has IFrame in it, maybe there is video tag in it,
                        to navigate to it click or{this.renderCheckAgainButton()}
                    </div><br />
                    <div className='link' onClick={this.navigateToIframeSource}>{this.props.iframeSource}</div>
                </>;
        } else {
        response =  <>This web page cannot use this extension{this.renderCheckAgainButton()}</>;
        }
        if (isDisabledState !== this.state.isDisabled) {
            this.setState({ isDisabled: isDisabledState });
        }
        return response;
    }

    public render() {
        return (
            <div className='video-end-component'>
                <div className='video-end-component__message'>
                    <div>{this.getMessage()}</div>
                <input
                    type='time'
                    step='1'
                    className={this.state.isDisabled ? 'time-selector disabled' : 'time-selector'}
                    disabled={this.state.isDisabled}
                    onChange={this.onTimeChange}
                    value={this.state.selectedTime}
                    min='00:00:00'
                />
                </div>
                <div className='video-end-component__buttons'><button
                    className={this.state.isDisabled ? 'tile-button disabled' : 'tile-button clickable'}
                    onClick={this.subscribe}
                    disabled={this.state.isDisabled}
                >SUBSCRIBE</button></div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(VideoEndShutdownComponent);