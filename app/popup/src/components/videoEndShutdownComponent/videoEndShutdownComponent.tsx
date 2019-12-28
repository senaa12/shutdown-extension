import { ContentScriptMessage, ContentScriptMessageTypeEnum, convertSecondsToTimeFormat, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import messanger from '../../utilities/contentScriptMessaging';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import InputTimeComponent from '../reusableComponents/inputTimeComponent';
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
            ...state.openTabsReducer.tabs[ownProps.activeTabId],
            subscribedTab: state.appReducer.tabId,
            selectedTime: state.appReducer.selectedTime,
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
                        to navigate to it click or
                    </div><br />
                    <div className='link' onClick={this.navigateToIframeSource}>{this.props.iframeSource}</div>
                </>;
        } else {
            response =  <>This web page cannot use this extension</>;
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
                <InputTimeComponent
                    onChange={this.props.timeChange}
                    value={this.props.selectedTime}
                    isDisabled={this.state.isDisabled}
                />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(VideoEndShutdownComponent);
