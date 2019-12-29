import { ApplicationModeEnum, ContentScriptMessage, ContentScriptMessageTypeEnum, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import Tooltip from 'react-tooltip-lite';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';

import messanger from '../../utilities/contentScriptMessaging';
import { AppOwnProps } from '../app';
import './actionButtons.scss';

export interface ActionButtonCustomProps {
    appMode: ApplicationModeEnum;
    isEventSubscribed: boolean;
    isShutdownButtonDisabled: boolean;
    tabID: number;
}

declare type ActionButtonProps = ActionButtonCustomProps & TabState;

export interface ActionButtonState {
    isScanTooltipOpen: boolean;
}

const mapStateToProps = (state: RootReducerState, ownProps: AppOwnProps): Partial<ActionButtonProps> => {
    const tabState: (TabState | undefined) =
        ownProps.currentTabId ? state.openTabsReducer.tabs[ownProps.currentTabId] : undefined;

    return {
        appMode: state.appReducer.selectedApplicationMode,
        isEventSubscribed: state.appReducer.isEventSubscibed,
        tabID: state.appReducer.tabId,
        isShutdownButtonDisabled: !(tabState?.documentHasVideoTag && !state.appReducer.isEventSubscibed),
        ...tabState,
    };
};

class ActionButtons extends React.Component<ActionButtonProps, ActionButtonState> {
    constructor(props: ActionButtonProps) {
        super(props);
        this.state = {
            isScanTooltipOpen: false,
        };
    }

    private baseClassName = 'action-button ';

    private renderShutdownButton = () => {
        const shutdown = () => {
            const message: ContentScriptMessage = {
                type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
                data: {
                    selectedTime: 'this.state.selectedTime',
                },
            };
            messanger.sendMessageToActiveTab(message);
        };

        const className = this.baseClassName + (this.props.isShutdownButtonDisabled ? 'disabled' : 'clickable');
        const onClick = this.props.isShutdownButtonDisabled ? () => {} : shutdown;
        return(
            <ButtonComponent
                    isSelected={false}
                    className={className}
                    label={'Shutdown'}
                    onClick={onClick}
                    icon={IconEnum.PowerButton}
                    iconSize={IconSize.Smallest}
            />
        );
    }

    private renderScanNowButton = () => {
        if (this.props.appMode === ApplicationModeEnum.Countdown) {
            return null;
        }

        const onClick = () => {
            const toggleTooltip = () => {
                this.setState({ isScanTooltipOpen: true });
                setTimeout(() => this.setState({ isScanTooltipOpen: false }), 2000);
            };

            const message: ContentScriptMessage = {
                type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                data: {
                    returnMessage: true,
                },
            };

            messanger.sendMessageToActiveTab(message, toggleTooltip);
        };

        const className = this.baseClassName +
            (!(this.props.isShutdownButtonDisabled && !this.props.isEventSubscribed) ? 'disabled' : 'clickable' );
        return(
            <Tooltip
                content={'test'}
                direction={'top'}
                isOpen={this.state.isScanTooltipOpen}
            >
                <ButtonComponent
                    isSelected={false}
                    className={className}
                    label={'Scan now'}
                    onClick={onClick}
                    icon={IconEnum.ScanNow}
                    iconSize={IconSize.Smallest}
                />
            </Tooltip>
        );
    }

    private renderClearButton = () => {
        const onClick = () => {
            const message: ContentScriptMessage = {
                type: ContentScriptMessageTypeEnum.RemoveSubscription,
            };
            messanger.sendMessageToTab(this.props.tabID, message);
        };
        const className = this.baseClassName + (this.props.isEventSubscribed ? 'clickable' : 'disabled');

        return (
            <ButtonComponent
                isSelected={false}
                className={className}
                label={'Cancel'}
                onClick={onClick}
                icon={IconEnum.Cancel}
                iconSize={IconSize.Smallest}
            />
        );
    }

    private renderDocsButton = () => {
        const onClick = () => {};
        return (
                <ButtonComponent
                    isSelected={false}
                    className={'action-button clickable'}
                    label={'Docs'}
                    onClick={onClick}
                    icon={IconEnum.OpenDocs}
                    iconSize={IconSize.Smallest}
                />
        );
    }

    public render() {
        return(
            <div className='action-buttons-container'>
                {this.renderShutdownButton()}
                {this.renderClearButton()}
                <div style={{flexGrow: 1}}/>
                {this.renderScanNowButton()}
                {this.renderDocsButton()}
            </div>
        );
    }
}

export default connect(mapStateToProps)(ActionButtons);
