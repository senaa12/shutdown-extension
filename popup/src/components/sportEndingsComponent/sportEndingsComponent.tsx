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
        return (
            <>
                <div className={descriptionClassname}>{sportEndingsComponentStrings.usageInstructions}</div>
                <SelectSportEventComponent />
                <div className={'optional-delay'}>
                    <Checkbox
                        label={'Add additional delay'}
                        checked={props.addDelayToShutdown}
                        handleOnCheckboxChange={props.setAddDelayToShutdown}
                        disabled={!props.selectedSportEvent || props.isShutdownScheduled}
                    />
                    <TimeDurationComponent
                        value={props.inputSelectedTime}
                        onChange={props.changeInputTime}
                        fontSize={20}
                        isDisabled={!props.addDelayToShutdown || props.isShutdownScheduled || !props.selectedSportEvent}
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
            {!props.isShutdownScheduled 
                ? shutdownNotScheduled()
                : shutdownScheduled()}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(sportEndingsComponent);
