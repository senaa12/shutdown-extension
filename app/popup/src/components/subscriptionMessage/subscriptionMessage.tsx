import { RootReducerState } from 'common';
import * as React from 'react';
import { connect } from 'react-redux';

export interface SubscriptionMessageProps {
    isEventSubscribed: boolean;
    tabId: number;
}

export interface SubscriptionMessageState {
    title?: string;
}

const mapStateToProps = (state: RootReducerState): SubscriptionMessageProps => {
    return {
        isEventSubscribed: state.shutdownSubscriptionReducer.isEventSubscibed,
        tabId: state.shutdownSubscriptionReducer.tabId,
    };
};

class SubscriptionMessage extends React.Component<SubscriptionMessageProps, SubscriptionMessageState> {
    constructor(props: SubscriptionMessageProps) {
        super(props);
        this.state = {
            title: '',
        };
    }

    public componentDidMount() {
        if (this.props.tabId > -1) {
            this.setTabTitle();
        }
    }

    public componentDidUpdate(prevProps: SubscriptionMessageProps) {
        if (prevProps.isEventSubscribed !== this.props.isEventSubscribed) {
            this.setTabTitle();
        }
    }

    private setTabTitle = () => chrome.tabs.get(this.props.tabId, (tabs) => this.setState({ title: tabs.title }));

    private renderControl = () => {
        if (!this.props.isEventSubscribed) {
            return null;
        } else if (this.props.tabId) {
            // TODO: promjeniti ovo
            const onClick = () => chrome.tabs.update({ openerTabId: this.props.tabId });
            return (
            <div>
                <div>Computer will shutdown after video finishes on tab</div>
                <br />
                <div onClick={onClick}>{this.state.title}</div>
            </div> );
        }
    }

    public render() {
        return (
            <div>
                {this.renderControl()}
            </div>
        );
    }

}

export default connect(mapStateToProps)(SubscriptionMessage);
