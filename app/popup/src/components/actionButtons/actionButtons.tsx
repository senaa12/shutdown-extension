import {
    ActionResultEnum,
    ApplicationModeEnum,
    BackgroundMessageTypeEnum,
    ChromeApiMessage,
    ContentScriptMessageTypeEnum,
    RootReducerState,
    TabState,
    TabStateEnum } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';

import { Dispatch } from 'redux';
import { triggerActionResultTooltip } from '../../actions/actions';
import communicationManager from '../../utilities/communicationManager';
import { ActiveTabReaderInjectedProps } from '../activeTabReader/activeTabReader';
import './actionButtons.scss';

export interface ActionButtonCustomProps {
    appMode: ApplicationModeEnum;
    isShutdownEventScheduled: number;
    isShutdownButtonDisabled: boolean;
    tabID: number;
    selectedTime: string;
    isHostAppActive: boolean;

    actionResultTooltipContent: React.ReactNode;
    actionResultTooltip: ActionResultEnum;
    triggerActionResultTooltip(newState: ActionResultEnum): void;
}

declare type ActionButtonProps = ActionButtonCustomProps & TabState & ActiveTabReaderInjectedProps;

// tslint:disable-next-line: max-line-length
const mapStateToProps = (state: RootReducerState, ownProps: ActiveTabReaderInjectedProps): Partial<ActionButtonProps> => {
    const isShutdownDisabled = state.appReducer.selectedApplicationMode === ApplicationModeEnum.VideoPlayer ?
        !(state.activeTabReducer?.state === TabStateEnum.PageContainsVideoTag
            && !state.appReducer.isShutdownEventScheduled) :
        !!state.appReducer.isShutdownEventScheduled;

    return {
        appMode: state.appReducer.selectedApplicationMode,
        isShutdownEventScheduled: state.appReducer.isShutdownEventScheduled,
        isShutdownButtonDisabled: isShutdownDisabled,
        actionResultTooltip: state.actionsResultReducer.actionResultTooltip,
        selectedTime: state.appReducer.inputSelectedTime,
        actionResultTooltipContent: state.actionsResultReducer.actionResultTooltipMessage,
        isHostAppActive: state.appReducer.isHostAppActive,
        ...state.activeTabReducer,
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
                    communicationManager.sendMessageToTab(this.props.tabID, {
                        type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
                        data: {
                            selectedTime: this.props.selectedTime,
                        },
                    } as ChromeApiMessage);
                    break;
                }
                case ApplicationModeEnum.Countdown: {
                    communicationManager.sendMessageToBackgroundPage({
                        type: BackgroundMessageTypeEnum.CountdownToShutdown,
                    } as ChromeApiMessage);
                    break;
                }
                default: {
                    communicationManager.sendMessageToBackgroundPage({
                        type: BackgroundMessageTypeEnum.TimerShutdown,
                    } as ChromeApiMessage);
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

        const onClick = () => {
                communicationManager.sendMessageToActiveTab({
                    type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                    data: { tabID: this.props.tabID, showResponse: true },
                } as ChromeApiMessage);
        };
        const className = this.baseClassName + (!!this.props.isShutdownEventScheduled ? 'disabled' : 'clickable' );
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
                    disabled={!!this.props.isShutdownEventScheduled}
                />
            </SimpleTooltipComponent>
        );
    }

    private renderClearButton = () => {
        const onClick = () => {
            if (this.props.isShutdownEventScheduled) {
                if (this.props.appMode === ApplicationModeEnum.VideoPlayer) {
                    communicationManager.sendMessageToTab(this.props.isShutdownEventScheduled, {
                        type: ContentScriptMessageTypeEnum.RemoveVideoShutdownEvent,
                    });
                } else {
                    communicationManager.sendMessageToBackgroundPage({
                        type: BackgroundMessageTypeEnum.RemoveShutdownEvent,
                    } as ChromeApiMessage);
                }

            }
        };

        const className = this.baseClassName + (this.props.isShutdownEventScheduled ? 'clickable cancel-hover' : 'disabled');
        const isCancelDisabled = !this.props.isHostAppActive || (this.props.currentTabId !== this.props.tabID
                    && this.props.appMode === ApplicationModeEnum.VideoPlayer);
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
                    disabled={isCancelDisabled}
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
