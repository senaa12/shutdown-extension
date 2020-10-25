import classNames from 'classnames';
import { BackgroundMessageTypeEnum, getMatchLabelFromMatchModel, isShutdownScheduledSelector, RootReducerState,
    SportApiMatchModel, sportEndingsComponentStrings,
    SportsApiFetchRequestType } from 'common';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setSelectedSportEventForShutdown } from '../../actions/actions';
import communication from '../../utilities/communicationManager';
import CheckboxComponent from '../reusableComponents/checkboxComponent';
import Dialog from '../reusableComponents/dialogComponent';
import LoadingComponent from '../reusableComponents/loadingComponent';

import './sportEndingsComponent.scss';

export interface SelectSportEventComponentProps {
    selectedSportEvent?: SportApiMatchModel;
    isShutdownScheduled: boolean;

    setSelectedSportEvent: (event?: SportApiMatchModel) => void;
}

const mapStateToProps = (state: RootReducerState): Partial<SelectSportEventComponentProps> => {
    return {
        isShutdownScheduled: isShutdownScheduledSelector(state),
        selectedSportEvent: state.sportsModeReducer.selectedSportEventForShutdown,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<SelectSportEventComponentProps> => {
    return {
        setSelectedSportEvent: (event?: SportApiMatchModel) =>
            dispatch(setSelectedSportEventForShutdown(event)),
    };
};

const selectSportEventComponentProps = (props: SelectSportEventComponentProps) => {
    const [ isSelectSportEventDialogOpen, setSelectSportEventDialogOpen ] = React.useState(false);
    const [ availableEvents, setAvailableEvents ] = React.useState<Array<SportApiMatchModel> | undefined>();

    const closeDialog = () => {
        setSelectSportEventDialogOpen(false);
    };

    const openDialog = React.useCallback(() => {
        if (!isSelectSportEventDialogOpen && !props.isShutdownScheduled) {
            setSelectSportEventDialogOpen(true);
        }
    }, [isSelectSportEventDialogOpen, props.isShutdownScheduled]);

    useEffect(() => {
        if (isSelectSportEventDialogOpen) {
            communication.sendMessageToBackgroundPage({
                type: BackgroundMessageTypeEnum.SportsApiFetch,
                data: SportsApiFetchRequestType.GetLiveMatches,
            }, setAvailableEvents);
        }
    }, [isSelectSportEventDialogOpen]);

    const checkSportEvent = (match: SportApiMatchModel) => () => {
        if (props.selectedSportEvent?.id === match.id) {
            props.setSelectedSportEvent(undefined);
        } else {
            props.setSelectedSportEvent(match);
        }
    };

    const renderSportsEvent = (match: SportApiMatchModel) => (
        <div className={'sport-event-tile'}>
            <CheckboxComponent
                checkboxClassname={'sport-event-checkbox'}
                checked={props.selectedSportEvent?.id === match.id}
                label={
                    <div className={'flex-column sport-event-checkbox-label'}>
                        <div className={'sport-event-league-name'}>{match.competitionName}</div>
                        <div className={'sport-event-teams'}>{match.homeTeam} : {match.awayTeam}</div>
                    </div>
                }
                handleOnCheckboxChange={checkSportEvent(match)}
            />
        </div>
    );

    const labelClassName = classNames({
        'select-sport-button': !props.selectedSportEvent || props.isShutdownScheduled,
        'sport-event-selected': props.selectedSportEvent,
    });

    const inputClassName = classNames('input-style input-style-fixes', {
        disabled: props.isShutdownScheduled,
    });

    return (
        <div className={inputClassName} onClick={openDialog}>
            <span className={labelClassName}>
                {!props.selectedSportEvent
                    ? sportEndingsComponentStrings.selectSportEvent
                    : getMatchLabelFromMatchModel(props.selectedSportEvent)}
            </span>
            <Dialog
                isOpen={isSelectSportEventDialogOpen}
                onClose={closeDialog}
                dialogClassName={'sport-event-select-dialog'}
            >
                {!availableEvents &&
                    <LoadingComponent />}
                {(availableEvents && !availableEvents.length) &&
                    <div className={'center-vertically select-sport-button'}>
                        {sportEndingsComponentStrings.noSportEvents}
                    </div>}
                {(availableEvents && !!availableEvents.length) &&
                    <>
                        {availableEvents.map(renderSportsEvent)}
                    </>}
            </Dialog>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(selectSportEventComponentProps);
