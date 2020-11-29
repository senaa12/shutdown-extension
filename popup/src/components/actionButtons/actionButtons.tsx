import classNames from 'classnames';
import {
    ActionResultEnum,
    actionResultsStrings,
    ApplicationModeEnum,
    BackgroundMessageTypeEnum,
    ChromeApiMessage,
    ContentScriptMessageTypeEnum,
    isShutdownScheduledSelector,
    RootReducerState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Dispatch } from 'redux';
import { toggleIsSportDialogOpen, triggerActionResultTooltip } from '../../actions/actions';
import communicationManager from '../../utilities/communicationManager';
import { ActiveTabReaderInjectedProps } from '../activeTabReader/activeTabReader';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';
import { isCancelButtonDisabledCheck, isShutdownButtonDisabledCheck } from './utils';

import './actionButtons.scss';

export interface ActionButtonCustomProps {
    appMode: ApplicationModeEnum;
    isShutdownEventScheduled: boolean;
    scheduledShutdownEventData: number;
    isShutdownButtonDisabled: boolean;
    isCancelButtonDisabled: boolean;
    selectedTime: string;
    videoDuration?: number;
    videoSrc?: string;
    isHostAppActive: boolean;

    actionResultTooltipContent: React.ReactNode;
    actionResultTooltip: ActionResultEnum;
}

export interface ActionButtonDispatchProps {
    triggerActionResultTooltip(newState: ActionResultEnum): void;
    openSelectSportDialog(): void;
}

declare type ActionButtonStateProps = ActionButtonCustomProps & ActiveTabReaderInjectedProps;
declare type ActionButtonProps = ActionButtonStateProps & ActionButtonDispatchProps;

export interface ActionButtonState {
    shutdownButtonRef?: React.MutableRefObject<any>;
}

const mapStateToProps = (state: RootReducerState, ownProps: ActiveTabReaderInjectedProps): ActionButtonStateProps => {
    return {
        appMode: state.appReducer.selectedApplicationMode,
        isShutdownEventScheduled: isShutdownScheduledSelector(state),
        scheduledShutdownEventData: state.appReducer.shutdownEventScheduleData,
        isShutdownButtonDisabled: isShutdownButtonDisabledCheck(state),
        isCancelButtonDisabled: isCancelButtonDisabledCheck(state, ownProps.currentTabId),
        actionResultTooltip: state.actionsResultReducer.actionResultTooltip,
        selectedTime: state.appReducer.inputSelectedTime,
        actionResultTooltipContent: state.actionsResultReducer.actionResultTooltipMessage,
        isHostAppActive: state.appReducer.isHostAppActive,
        videoDuration: state.activeTabReducer.videoDuration,
        videoSrc: state.activeTabReducer.src,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): ActionButtonDispatchProps => {
    return {
        triggerActionResultTooltip: (newState: ActionResultEnum, mess?: React.ReactNode) =>
            dispatch(triggerActionResultTooltip(newState, mess)),
        openSelectSportDialog: () => dispatch(toggleIsSportDialogOpen(true)),
    };
};

class ActionButtons extends React.Component<ActionButtonProps, ActionButtonState> {
    constructor(props: ActionButtonProps) {
        super(props);

        this.shutdownButtonRef = React.createRef();
        this.cancelButtonRef = React.createRef();
        this.scanNowButtonRef = React.createRef();
        this.addSportButtonRef = React.createRef();
    }

    private shutdownButtonRef: React.RefObject<any>;
    private cancelButtonRef: React.RefObject<any>;
    private scanNowButtonRef: React.RefObject<any>;
    private addSportButtonRef: React.RefObject<any>;

    private baseClassName = 'action-button';
    private actionTooltipsBaseClassName = 'action-tooltips';

    public componentDidMount() {
        this.checkToHideTooltip();
    }

    public componentDidUpdate() {
        this.checkToHideTooltip();
    }

    private checkToHideTooltip = () => {
        if (this.props.actionResultTooltip && this.props.actionResultTooltip !== ActionResultEnum.SelectLeagues) {
            this.props.triggerActionResultTooltip(ActionResultEnum.None);
        }
    }

    private renderShutdownButton = () => {
        const { appMode, currentTabId, selectedTime, videoDuration, videoSrc,
            isShutdownEventScheduled, isShutdownButtonDisabled,
            actionResultTooltip, actionResultTooltipContent } = this.props;
        const shutdown = () => {
            switch (appMode) {
                case ApplicationModeEnum.VideoPlayer: {
                    communicationManager.sendMessageToTab(currentTabId ?? 0, {
                        type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
                        data: { selectedTime, videoDuration, videoSrc },
                    } as ChromeApiMessage);
                    break;
                }
                case ApplicationModeEnum.Countdown: {
                    communicationManager.sendMessageToBackgroundPage({
                        type: BackgroundMessageTypeEnum.CountdownToShutdown,
                    } as ChromeApiMessage);
                    break;
                }
                case ApplicationModeEnum.Timer: {
                    communicationManager.sendMessageToBackgroundPage({
                        type: BackgroundMessageTypeEnum.TimerShutdown,
                    } as ChromeApiMessage);
                    break;
                }
                case ApplicationModeEnum.SportEvent: {
                    communicationManager.sendMessageToBackgroundPage({
                        type: BackgroundMessageTypeEnum.SportEventShutdown,
                    } as ChromeApiMessage);
                    break;
                }
                default: {
                    const exhaustiveCheck: never = appMode;
                }
            }
        };

        const onClick = isShutdownButtonDisabled ? undefined : shutdown;
        const tooltipClassName = classNames(this.actionTooltipsBaseClassName, {
            'sucess-tooltip':  isShutdownEventScheduled,
            'error-tooltip': !isShutdownEventScheduled,
        });
        return (
            <SimpleTooltipComponent
                content={actionResultTooltipContent}
                isOpen={actionResultTooltip === ActionResultEnum.Shutdown}
                trigger={'manual'}
                tooltipClassname={tooltipClassName}
                parentRef={this.shutdownButtonRef}
            >
                <ButtonComponent
                    ref={this.shutdownButtonRef}
                    className={this.baseClassName}
                    label={'Shutdown'}
                    onClick={onClick}
                    icon={IconEnum.PowerButton}
                    iconSize={IconSize.Smallest}
                    disabled={isShutdownButtonDisabled}
                />
            </SimpleTooltipComponent>
        );
    }

    private renderScanNowButton = () => {
        const { appMode, currentTabId, isShutdownEventScheduled,
            actionResultTooltip, actionResultTooltipContent } = this.props;

        const onClick = () => {
            communicationManager.sendMessageToActiveTab({
                    type: ContentScriptMessageTypeEnum.CheckVideoAvailability,
                    data: { tabID: currentTabId, showResponse: true },
                } as ChromeApiMessage);
        };

        return(
            <SimpleTooltipComponent
                parentRef={this.scanNowButtonRef}
                content={actionResultTooltipContent}
                isOpen={actionResultTooltip === ActionResultEnum.Scan && appMode === ApplicationModeEnum.VideoPlayer}
                trigger={'manual'}
                tooltipClassname={this.actionTooltipsBaseClassName}
            >
                <ButtonComponent
                    ref={this.scanNowButtonRef}
                    className={this.baseClassName}
                    label={'Scan now'}
                    onClick={onClick}
                    icon={IconEnum.ScanNow}
                    iconSize={IconSize.Smallest}
                    disabled={isShutdownEventScheduled}
                />
            </SimpleTooltipComponent>
        );
    }

    private renderAddSportsButton = () => {
        const { isShutdownEventScheduled, openSelectSportDialog ,
            actionResultTooltip, actionResultTooltipContent} = this.props;

        const tooltipClassName = classNames(this.actionTooltipsBaseClassName, 'sucess-tooltip');
        return (
            <SimpleTooltipComponent
                parentRef={this.addSportButtonRef}
                content={actionResultTooltipContent}
                isOpen={actionResultTooltip === ActionResultEnum.Saved}
                trigger={'manual'}
                tooltipClassname={tooltipClassName}
            >
                <ButtonComponent
                    ref={this.addSportButtonRef}
                    className={this.baseClassName}
                    label={'Add sports'}
                    onClick={openSelectSportDialog}
                    icon={IconEnum.Plus}
                    iconSize={IconSize.Smallest}
                    disabled={isShutdownEventScheduled}
                />
            </SimpleTooltipComponent>
        );
    }

    private renderClearButton = () => {
        const { appMode, isCancelButtonDisabled, isShutdownEventScheduled, scheduledShutdownEventData,
            actionResultTooltip, actionResultTooltipContent } = this.props;
        const onClick = () => {
            if (appMode === ApplicationModeEnum.VideoPlayer) {
                communicationManager.sendMessageToTab(scheduledShutdownEventData, {
                    type: ContentScriptMessageTypeEnum.RemoveVideoShutdownEvent,
                });
            } else {
                communicationManager.sendMessageToBackgroundPage({
                    type: BackgroundMessageTypeEnum.RemoveShutdownEvent,
                } as ChromeApiMessage);
            }
        };

        const className = classNames(this.baseClassName, {
            'cancel-hover': isShutdownEventScheduled,
        });
        return (
            <SimpleTooltipComponent
                parentRef={this.cancelButtonRef}
                content={actionResultTooltipContent}
                isOpen={actionResultTooltip === ActionResultEnum.Canceled}
                trigger={'manual'}
                tooltipClassname={'action-tooltips cancel error-tooltip'}
            >
                <ButtonComponent
                    ref={this.cancelButtonRef}
                    className={className}
                    label={'Cancel'}
                    onClick={onClick}
                    icon={IconEnum.Cancel}
                    iconSize={IconSize.Smallest}
                    disabled={isCancelButtonDisabled}
                />
            </SimpleTooltipComponent>
        );
    }

    public render() {
        const { appMode } = this.props;

        return(
            <div className='action-buttons-container'>
                {this.renderShutdownButton()}
                {this.renderClearButton()}
                <TransitionGroup className={'right-buttons'} >
                    {appMode === ApplicationModeEnum.VideoPlayer &&
                        <CSSTransition id={Math.round(Math.random() * 10000)} timeout={300} classNames={'shutdown-animation'}>
                            {this.renderScanNowButton()}
                        </CSSTransition>
                    }
                    {appMode === ApplicationModeEnum.SportEvent &&
                        <CSSTransition id={Math.round(Math.random() * 10000)} timeout={300} classNames={'shutdown-animation'}>
                            {this.renderAddSportsButton()}
                        </CSSTransition>
                    }
                </TransitionGroup>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionButtons);
