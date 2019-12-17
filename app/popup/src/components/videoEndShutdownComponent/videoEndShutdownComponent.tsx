import { RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import SubscribeShutdownButton from './subscribeShutdownButton/subscribeShutdownButton';

interface Substitute {
    activeTabId?: number;
}

interface VideoEndShutdownComponentState {
    tabTitle?: string;
    isEventSubscribed: boolean;
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
            subscribedTab: state.shutdownSubscriptionReducer.tabId,
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
            isEventSubscribed: props.subscribedTab !== undefined && props.subscribedTab > 0,
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

    private getMessage = () => {
        const { isEventSubscribed } = this.state;
        const { activeTabId, subscribedTab, documentHasVideoTag, documentHasIFrameTag } = this.props;
        if (isEventSubscribed && activeTabId === subscribedTab) {
                return <>After video on this web page ends, computer will shut down</>;
            } else if (isEventSubscribed) {
                return (
                    <>
                        <div>Computer will shut down after video ends at tab</div><br />
                        <div className='link' onClick={this.navigateToSelectedTab}>{this.state.tabTitle}</div>
                    </>
                    );
            } else if (documentHasVideoTag) {
                return 'Click subscribe shut down computer after video ends';
            } else if (documentHasIFrameTag) {
                return (
                    <>
                        <div>This web page has IFrame in it, to navigate to it click</div><br />
                        <div className='link' onClick={this.navigateToIframeSource}>{this.props.iframeSource}</div>
                    </>
                );
            } else {
                return 'This web page cannot use this extension';
            }
        }

    public render() {
        return(
            <div >
                <SubscribeShutdownButton
                    disbled={!this.props.documentHasVideoTag && this.state.isEventSubscribed} />
                <div>{this.getMessage()}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps)(VideoEndShutdownComponent);
