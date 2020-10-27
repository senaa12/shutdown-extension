import classNames from 'classnames';
import { BackgroundMessageTypeEnum, getMatchLabelFromMatchModel, isShutdownScheduledSelector, RootReducerState,
    SportApiMatchModel, sportEndingsComponentStrings, SportsApiRequestType, SportsEnum, sportsLabel } from 'common';
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
    isHostAppActive: boolean;

    setSelectedSportEvent: (event?: SportApiMatchModel) => void;
}

const mapStateToProps = (state: RootReducerState): Partial<SelectSportEventComponentProps> => {
    return {
        isHostAppActive: state.appReducer.isHostAppActive,
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
                data: {
                    type: SportsApiRequestType.GetLiveGames
                },
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
    
    const renderSportsEvent = (match: SportApiMatchModel, renderSportLabel: boolean) => (
        <>
            {renderSportLabel && <div className={'sports-label'}>{sportsLabel[match.sport]}</div>}
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
        </>
    );

    const renderDialogMenuWithEvents = () => {
        let includedSports = new Array<SportsEnum>();

        // sort by sport and next sort by league
        const sortingFunction = (x: SportApiMatchModel, y: SportApiMatchModel) => {
            if(x.sport > y.sport) {
                return 1;
            } else if (x.sport < y.sport) {
                return -1;
            } else {
                return x.league < y.league ? 1 : -1;
            }
        }

        return (
            <>
                {availableEvents!.sort(sortingFunction).map((event) => {
                    let renderSportLabel = false;
                    if(!includedSports.includes(event.sport)) {
                        includedSports.push(event.sport);
                        renderSportLabel = true;
                    }

                    return renderSportsEvent(event, renderSportLabel);
                })}
            </>
        )
    }

    const labelClassName = classNames({
        'select-sport-button': !props.selectedSportEvent || props.isShutdownScheduled,
        'sport-event-selected': props.selectedSportEvent,
        'host-disabled': props.isHostAppActive
    });

    const inputClassName = classNames('input-style input-style-fixes', {
        disabled: props.isShutdownScheduled,
        'host-disabled': props.isHostAppActive
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
            >
                {(!availableEvents && availableEvents === undefined) &&
                    <LoadingComponent />}
                {(availableEvents && !availableEvents.length) &&
                    <div className={'center-vertically select-sport-button'}>
                        {sportEndingsComponentStrings.noSportEvents}
                    </div>}
                {(availableEvents && !!availableEvents.length) &&
                    renderDialogMenuWithEvents()}
            </Dialog>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(selectSportEventComponentProps);
