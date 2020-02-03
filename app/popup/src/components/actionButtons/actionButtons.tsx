import { ActionResultEnum, ApplicationModeEnum, BackgroundMessage,
        BackgroundMessageTypeEnum, ContentScriptMessage, ContentScriptMessageTypeEnum,
        links, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';

import { Dispatch } from 'redux';
import { triggerActionResultTooltip } from '../../actions/actions';
import communicationManager from '../../utilities/communicationManager';
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
    const isShutdownDisabled = state.appReducer.selectedApplicationMode === ApplicationModeEnum.VideoPlayer ?
        !(tabState?.documentHasVideoTag && !state.appReducer.isShutdownEventScheduled) :
        !!state.appReducer.isShutdownEventScheduled;

    return {
        appMode: state.appReducer.selectedApplicationMode,
        isShutdownEventScheduled: state.appReducer.isShutdownEventScheduled,
        isShutdownButtonDisabled: isShutdownDisabled,
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
            switch (this.props.appMode) {
                case ApplicationModeEnum.VideoPlayer: {
                    const message: ContentScriptMessage = {
                        type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
                        data: {
                            selectedTime: this.props.selectedTime,
                        },
                    };
                    communicationManager.sendMessageToActiveTab(message);
                    break;
                }
                case ApplicationModeEnum.Countdown: {
                    const message: BackgroundMessage = {
                        type: BackgroundMessageTypeEnum.CountdownToShutdown,
                    };
                    communicationManager.sendMessageToBackgroundPage(message);
                    break;
                }
                default: {
                    const message: BackgroundMessage = {
                        type: BackgroundMessageTypeEnum.TimerShutdown,
                    };
                    communicationManager.sendMessageToBackgroundPage(message);
                }
            }
        };

        const className = this.baseClassName + (this.props.isShutdownButtonDisabled ? 'disabled' : 'clickable');
        // tslint:disable-next-line: no-empty
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
        if (this.props.appMode !== ApplicationModeEnum.VideoPlayer) {
            return null;
        }

        const scanDisabled = !(this.props.isShutdownButtonDisabled && !this.props.isShutdownEventScheduled);
        const onClick = () => {
            if (!scanDisabled) {
                const message: ContentScriptMessage = {
                    type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                    data: { tabID: this.props.currentTabID, showResponse: true },
                };

                communicationManager.sendMessageToActiveTab(message);
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
                    disabled={scanDisabled}
                />
            </SimpleTooltipComponent>
        );
    }

    private renderClearButton = () => {
        const onClick = () => {
            if (this.props.isShutdownEventScheduled) {
                if (this.props.appMode === ApplicationModeEnum.VideoPlayer) {
                    const message: ContentScriptMessage = {
                        type: ContentScriptMessageTypeEnum.RemoveVideoScheduledShutdown,
                    };
                    communicationManager.sendMessageToTab(this.props.isShutdownEventScheduled, message);
                } else {
                    const message: BackgroundMessage = {
                        type: BackgroundMessageTypeEnum.RemoveCountdownToShutdown,
                    };
                    communicationManager.sendMessageToBackgroundPage(message);
                }
            }
        };
        const className = this.baseClassName + (this.props.isShutdownEventScheduled ? 'clickable cancel-hover' : 'disabled');
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

    public render() {
        return(
            <div className='action-buttons-container'>
                {this.renderShutdownButton()}
                {this.renderClearButton()}
                <div style={{flexGrow: 1}}/>
                {this.renderScanNowButton()}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
