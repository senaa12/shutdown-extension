import { ActionResultEnum, ActionTypeEnum,
    ApplicationModeEnum, ContentScriptMessage, ContentScriptMessageTypeEnum, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';

import { Dispatch } from 'redux';
import { triggerActionResultTooltip } from '../../actions/actions';
import messanger from '../../utilities/contentScriptMessaging';
import app, { AppOwnProps } from '../app';
import './actionButtons.scss';

export interface ActionButtonCustomProps {
    appMode: ApplicationModeEnum;
    isEventSubscribed: boolean;
    isShutdownButtonDisabled: boolean;
    tabID: number;
    currentTabID: number;
    selectedTime: string;
    actionResultTooltip: ActionResultEnum;
    triggerActionResultTooltip(newState: ActionResultEnum): void;
}

declare type ActionButtonProps = ActionButtonCustomProps & TabState;

const mapStateToProps = (state: RootReducerState, ownProps: AppOwnProps): Partial<ActionButtonProps> => {
    const tabState: (TabState | undefined) =
        ownProps.currentTabId ? state.openTabsReducer.tabs[ownProps.currentTabId] : undefined;

    return {
        appMode: state.appReducer.selectedApplicationMode,
        isEventSubscribed: state.appReducer.isEventSubscibed,
        tabID: state.appReducer.tabId,
        isShutdownButtonDisabled: !(tabState?.documentHasVideoTag && !state.appReducer.isEventSubscibed),
        currentTabID: ownProps.currentTabId,
        actionResultTooltip: state.appReducer.openActionResultTooltip,
        selectedTime: state.appReducer.selectedTime,
        ...tabState,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<ActionButtonProps> => {
    return {
        triggerActionResultTooltip : (newState: ActionResultEnum) => dispatch(triggerActionResultTooltip(newState)),
    };
};

class ActionButtons extends React.Component<ActionButtonProps> {
    constructor(props: ActionButtonProps) {
        super(props);
    }

    private baseClassName = 'action-button ';

    public componentDidUpdate() {
        if (this.props.actionResultTooltip) {
            setTimeout(() => this.props.triggerActionResultTooltip(ActionResultEnum.None), 2000);
        }
    }

    private renderShutdownButton = () => {
        const shutdown = () => {
            const message: ContentScriptMessage = {
                type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
                data: {
                    selectedTime: this.props.selectedTime,
                },
            };
            messanger.sendMessageToActiveTab(message);
        };

        const className = this.baseClassName + (this.props.isShutdownButtonDisabled ? 'disabled' : 'clickable');
        const onClick = this.props.isShutdownButtonDisabled ? () => {} : shutdown;
        return(
            <SimpleTooltipComponent
                content={this.props.isEventSubscribed ? 'Complete' : 'Error' }
                isOpen={this.props.actionResultTooltip === ActionResultEnum.Shutdown}
                id={'shutdown-button'}
                trigger={'manual'}
            >
                <ButtonComponent
                        isSelected={false}
                        className={className}
                        label={'Shutdown'}
                        onClick={onClick}
                        icon={IconEnum.PowerButton}
                        iconSize={IconSize.Smallest}
            />
            </SimpleTooltipComponent>
        );
    }

    private renderScanNowButton = () => {
        if (this.props.appMode === ApplicationModeEnum.Countdown) {
            return null;
        }

        const onClick = () => {
            const message: ContentScriptMessage = {
                type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                data: { tabID: this.props.currentTabID },
            };

            messanger.sendMessageToActiveTab(message);
        };

        const className = this.baseClassName +
            (!(this.props.isShutdownButtonDisabled && !this.props.isEventSubscribed) ? 'disabled' : 'clickable' );
        return(
            <SimpleTooltipComponent
                content={'No Changes'}
                isOpen={this.props.actionResultTooltip === ActionResultEnum.Scan}
                id={'scan-button'}
                trigger={'manual'}
            >
                <ButtonComponent
                    isSelected={false}
                    className={className}
                    label={'Scan now'}
                    onClick={onClick}
                    icon={IconEnum.ScanNow}
                    iconSize={IconSize.Smallest}
                />
            </SimpleTooltipComponent>
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
            <SimpleTooltipComponent
                content={'Shutdown Canceled'}
                isOpen={this.props.actionResultTooltip === ActionResultEnum.Canceled}
                id={'cancel-button'}
                trigger={'manual'}
            >
                <ButtonComponent
                    isSelected={false}
                    className={className}
                    label={'Cancel'}
                    onClick={onClick}
                    icon={IconEnum.Cancel}
                    iconSize={IconSize.Smallest}
                />
            </SimpleTooltipComponent>
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

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
