import { ActionResultEnum, ApplicationModeEnum, ContentScriptMessage,
        ContentScriptMessageTypeEnum, links, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';

import { Dispatch } from 'redux';
import { triggerActionResultTooltip } from '../../actions/actions';
import messanger from '../../utilities/contentScriptMessaging';
import { AppOwnProps } from '../app';
import './actionButtons.scss';

export interface ActionButtonCustomProps {
    appMode: ApplicationModeEnum;
    isShutdownEventScheduled: number;
    isShutdownButtonDisabled: boolean;
    currentTabID: number;
    selectedTime: string;
    isHostAppActive: boolean;

    actionResultTooltipContent: React.ReactNode;
    actionResultTooltip: ActionResultEnum;
    triggerActionResultTooltip(newState: ActionResultEnum): void;
}

declare type ActionButtonProps = ActionButtonCustomProps & TabState;

const mapStateToProps = (state: RootReducerState, ownProps: AppOwnProps): Partial<ActionButtonProps> => {
    const tabState: (TabState | undefined) =
        ownProps.currentTabId ? state.openTabsReducer[ownProps.currentTabId] : undefined;

    return {
        appMode: state.appReducer.selectedApplicationMode,
        isShutdownEventScheduled: state.appReducer.isShutdownEventScheduled,
        isShutdownButtonDisabled: !(tabState?.documentHasVideoTag && !state.appReducer.isShutdownEventScheduled),
        currentTabID: ownProps.currentTabId,
        actionResultTooltip: state.actionsResultReducer.actionResultTooltip,
        selectedTime: state.appReducer.inputSelectedTime,
        actionResultTooltipContent: state.actionsResultReducer.actionResultTooltipMessage,
        isHostAppActive: state.appReducer.isHostAppActive,
        ...tabState,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<ActionButtonProps> => {
    return {
        triggerActionResultTooltip: (newState: ActionResultEnum, mess?: React.ReactNode) =>
            dispatch(triggerActionResultTooltip(newState, mess)),
    };
};

class ActionButtons extends React.Component<ActionButtonProps> {
    constructor(props: ActionButtonProps) {
        super(props);
    }

    private baseClassName = 'action-button ';

    public componentDidMount() {
        this.checkToHideTooltip();
    }

    public componentDidUpdate() {
        this.checkToHideTooltip();
    }

    private checkToHideTooltip = () => {
        if (this.props.actionResultTooltip) {
            this.props.triggerActionResultTooltip(ActionResultEnum.None);
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
                content={this.props.actionResultTooltipContent}
                isOpen={this.props.actionResultTooltip === ActionResultEnum.Shutdown}
                trigger={'manual'}
                tooltipClassname={'action-tooltips ' + (this.props.isShutdownEventScheduled ? 'sucess-tooltip' : 'error-tooltip')}
            >
                <ButtonComponent
                        isSelected={false}
                        className={className}
                        label={'Shutdown'}
                        onClick={onClick}
                        icon={IconEnum.PowerButton}
                        iconSize={IconSize.Smallest}
                        disabled={!this.props.isHostAppActive}
            />
            </SimpleTooltipComponent>
        );
    }

    private renderScanNowButton = () => {
        const scanDisabled = !(this.props.isShutdownButtonDisabled && !this.props.isShutdownEventScheduled);
        if (this.props.appMode === ApplicationModeEnum.Countdown) {
            return null;
        }

        const onClick = () => {
            if (!scanDisabled) {
                const message: ContentScriptMessage = {
                    type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                    data: { tabID: this.props.currentTabID, showResponse: true },
                };

                messanger.sendMessageToActiveTab(message);
            }
        };
        const className = this.baseClassName + (scanDisabled ? 'disabled' : 'clickable' );
        return(
            <SimpleTooltipComponent
                content={this.props.actionResultTooltipContent}
                isOpen={this.props.actionResultTooltip === ActionResultEnum.Scan}
                trigger={'manual'}
                tooltipClassname={'action-tooltips'}
            >
                <ButtonComponent
                    isSelected={false}
                    className={className}
                    label={'Scan now'}
                    onClick={onClick}
                    icon={IconEnum.ScanNow}
                    iconSize={IconSize.Smallest}
                    disabled={!this.props.isHostAppActive}
                />
            </SimpleTooltipComponent>
        );
    }

    private renderClearButton = () => {
        const onClick = () => {
            if (this.props.isShutdownEventScheduled) {
                const message: ContentScriptMessage = {
                    type: ContentScriptMessageTypeEnum.RemoveSubscription,
                };
                messanger.sendMessageToTab(this.props.isShutdownEventScheduled, message);
            }
        };
        const className = this.baseClassName + (this.props.isShutdownEventScheduled ? 'clickable' : 'disabled');
        return (
            <SimpleTooltipComponent
                content={this.props.actionResultTooltipContent}
                isOpen={this.props.actionResultTooltip === ActionResultEnum.Canceled}
                trigger={'manual'}
                tooltipClassname={'action-tooltips cancel error-tooltip'}
            >
                <ButtonComponent
                    isSelected={false}
                    className={className}
                    label={'Cancel'}
                    onClick={onClick}
                    icon={IconEnum.Cancel}
                    iconSize={IconSize.Smallest}
                    disabled={!this.props.isHostAppActive}
                />
            </SimpleTooltipComponent>
        );
    }

    private renderDocsButton = () => {
        const onClick = () => chrome.tabs.create({ url: `${links.docs}` });
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
