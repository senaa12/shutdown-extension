import { ActionResultEnum, 
    getMatchLabelFromMatchModel, 
    getSelectedTimeLabel,
    isShutdownScheduledSelector,
    RootReducerState,
    SportApiMatchModel,
    sportEndingsComponentStrings } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { changeTimeSelected, setAddDelayToSportShutdown, triggerActionResultTooltip } from '../../actions/actions';
import Checkbox from '../reusableComponents/checkboxComponent';
import TimeDurationComponent from '../reusableComponents/timeDurationComponent';
import SelectSportEventComponent from './selectSportEventComponent';
import classNames from 'classnames';
import SelectSportDialog from './selectSportDialog/selectSportDialog';

import './sportEndingsComponent.scss';

export interface SportEndingsComponentProps {
    selectedSportEvent?: SportApiMatchModel;
    isShutdownScheduled: boolean;
    isHostappActive: boolean;
    triggerActionResultTooltip: (newState: ActionResultEnum, mess?: React.ReactNode) => void;

    inputSelectedTime: string;
    changeInputTime(newTime: string): void;

    addDelayToShutdown: boolean;
    setAddDelayToShutdown(value: boolean): void;

    actionResultTooltip: ActionResultEnum;
    actionResultTooltipContent: React.ReactNode;
}

const mapStateToProps = (state: RootReducerState): Partial<SportEndingsComponentProps> => {
    return {
        isHostappActive: state.appReducer.isHostAppActive,
        selectedSportEvent: state.sportsModeReducer.selectedSportEventForShutdown,
        isShutdownScheduled: isShutdownScheduledSelector(state),
        actionResultTooltip: state.actionsResultReducer.actionResultTooltip,
        actionResultTooltipContent: state.actionsResultReducer.actionResultTooltipMessage,
        inputSelectedTime: state.appReducer.inputSelectedTime,
        addDelayToShutdown: state.sportsModeReducer.addDelayToShutdown,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<SportEndingsComponentProps> => {
    return {
        triggerActionResultTooltip: (newState: ActionResultEnum, mess?: React.ReactNode) =>
            dispatch(triggerActionResultTooltip(newState, mess)),
        changeInputTime: (newTime: string) => dispatch(changeTimeSelected(newTime)),
        setAddDelayToShutdown: (value: boolean) => dispatch(setAddDelayToSportShutdown(value)),

    };
};

const sportEndingsComponent = (props: SportEndingsComponentProps) => {
    const shutdownNotScheduled = () => {
        const descriptionClassname = classNames('usage-description', {
            'host-disabled': !props.isHostappActive
        })
        const checkboxWrapperClassname = classNames('optional-delay', {
            'host-disabled': !props.isHostappActive
        });

        return (
            <>
                <div className={descriptionClassname}>{sportEndingsComponentStrings.usageInstructions}</div>
                <SelectSportEventComponent />
                <div className={checkboxWrapperClassname}>
                    <Checkbox
                        label={'Add additional delay'}
                        checked={props.addDelayToShutdown}
                        handleOnCheckboxChange={props.setAddDelayToShutdown}
                        disabled={!props.selectedSportEvent || props.isShutdownScheduled}
                        style={{ paddingLeft: 0 }}
                    />
                    <TimeDurationComponent
                        inputClassName={'time-input-fix'}
                        value={props.inputSelectedTime}
                        onChange={props.changeInputTime}
                        fontSize={20}
                        isDisabled={!props.addDelayToShutdown || props.isShutdownScheduled || !props.selectedSportEvent}
                        style={{ marginRight: 0, marginLeft: 'auto'  }}
                    />
                </div>
            </>
        );
    };

    const shutdownScheduled = () => {
        const inputTimeLabel = getSelectedTimeLabel(props.inputSelectedTime);
        return (
            <>
                <div className={'shutdown-scheduled'}>
                    {inputTimeLabel !== ''
                        ? sportEndingsComponentStrings.sportShutdownWithDelayScheduled(
                            inputTimeLabel, <b>{getMatchLabelFromMatchModel(props.selectedSportEvent!)}</b>,
                        )
                        : sportEndingsComponentStrings.sportShutdownScheduledAfterEnd(
                            <b>{getMatchLabelFromMatchModel(props.selectedSportEvent!)}</b>,
                        )
                    }
                </div>
            </>
        );
    };

    return (
        <div className={'flex-column'}>
            <SelectSportDialog />
            {!props.isShutdownScheduled 
                ? shutdownNotScheduled()
                : shutdownScheduled()}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(sportEndingsComponent);
