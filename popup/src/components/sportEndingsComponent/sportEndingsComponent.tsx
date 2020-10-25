import { ActionResultEnum, BackgroundMessageTypeEnum, getMatchLabelFromMatchModel, getSelectedTimeLabel, isShutdownScheduledSelector,
    isSportsApiEnabledSelector, RootReducerState,
    SportApiMatchModel,
    sportEndingsComponentStrings, SportsApiFetchRequestType } from 'common';
import React, { useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { changeTimeSelected, setAddDelayToSportShutdown, setIsSportsApiEnabledState, triggerActionResultTooltip } from '../../actions/actions';
import communication from '../../utilities/communicationManager';
import Checkbox from '../reusableComponents/checkboxComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';
import TimeDurationComponent from '../reusableComponents/timeDurationComponent';
import SelectSportEventComponent from './selectSportEventComponent';

import './sportEndingsComponent.scss';

export interface SportEndingsComponentProps {
    selectedSportEvent?: SportApiMatchModel;
    isShutdownScheduled: boolean;
    isSportsApiEnabled: boolean;
    setIsSportsApiEnabled: (enabled: boolean) => void;
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
        selectedSportEvent: state.sportsModeReducer.selectedSportEventForShutdown,
        isShutdownScheduled: isShutdownScheduledSelector(state),
        isSportsApiEnabled: isSportsApiEnabledSelector(state),
        actionResultTooltip: state.actionsResultReducer.actionResultTooltip,
        actionResultTooltipContent: state.actionsResultReducer.actionResultTooltipMessage,
        inputSelectedTime: state.appReducer.inputSelectedTime,
        addDelayToShutdown: state.sportsModeReducer.addDelayToShutdown,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<SportEndingsComponentProps> => {
    return {
        setIsSportsApiEnabled: (enabled: boolean) => dispatch(setIsSportsApiEnabledState(enabled)),
        triggerActionResultTooltip: (newState: ActionResultEnum, mess?: React.ReactNode) =>
            dispatch(triggerActionResultTooltip(newState, mess)),
        changeInputTime: (newTime: string) => dispatch(changeTimeSelected(newTime)),
        setAddDelayToShutdown: (value: boolean) => dispatch(setAddDelayToSportShutdown(value)),

    };
};

const sportEndingsComponent = (props: SportEndingsComponentProps) => {
    const [apiKey, setapiKey] = React.useState<undefined | string>(undefined);
    const tooltipParentRef = useRef<HTMLDivElement>(null);

    const onClickTestApiKeyButton = useCallback(() => communication.sendMessageToBackgroundPage({
        type: BackgroundMessageTypeEnum.SportsApiFetch,
        data: {
            requestType: SportsApiFetchRequestType.Test,
            token: apiKey,
        },
    }, (result) => {
        if (result.success) {
            props.setIsSportsApiEnabled(true);
        } else {
            props.triggerActionResultTooltip(ActionResultEnum.WrongToken, result.errorMsg);
        }
    }), [props.setIsSportsApiEnabled, apiKey]);

    const apiDisabledComponent = () => {
        const onChangeInput = (e) => setapiKey(e.target.value);

        return (
            <>
                <div className={'disabled-description'}>{sportEndingsComponentStrings.apiDisabled()}</div>
                <SimpleTooltipComponent
                    parentRef={tooltipParentRef}
                    content={props.actionResultTooltipContent}
                    isOpen={props.actionResultTooltip === ActionResultEnum.WrongToken}
                    trigger={'manual'}
                    tooltipClassname={'sports-error-tooltip error-tooltip'}
                    position={'bottom'}
                    tooltipHideAnimationDuration={1500}
                >
                    <div className={'api-input-wrapper'} ref={tooltipParentRef}>
                        <input
                            onChange={onChangeInput}
                            className={'input-style override-style'}
                            placeholder={'Paste your token here'}
                        />
                        <button
                            onClick={onClickTestApiKeyButton}
                            className={'button-base tile clickable override-button-style'}
                        >Test key</button>
                    </div>
                </SimpleTooltipComponent>
            </>
        );
    };

    const apiEnabledComponent = () => {
        return (
            <>
                <div className={'usage-description'}>{sportEndingsComponentStrings.usageInstructions}</div>
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

    const sportEventShutdownScheduled = () => {
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
            {!props.isSportsApiEnabled &&
                apiDisabledComponent()}
            {(props.isSportsApiEnabled && !props.isShutdownScheduled) &&
                apiEnabledComponent()}
            {props.isShutdownScheduled &&
                sportEventShutdownScheduled()}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(sportEndingsComponent);
