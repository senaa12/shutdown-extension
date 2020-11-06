import { ActionResultEnum, actionResultsStrings, arrayDeepEqual, BackgroundMessageTypeEnum,
    groupBy, RootReducerState, sportEndingsComponentStrings,
    SportLeagueModel, SportsApiRequestType, SportsEnum, sportsLabel, StorageLocalKeys } from 'common';
import { debounce } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { toggleIsSportDialogOpen, triggerActionResultTooltip } from '../../../actions/actions';
import communication from '../../../utilities/communicationManager';
import CheckboxComponent from '../../reusableComponents/checkboxComponent';
import Dialog from '../../reusableComponents/dialogComponent';
import LoadingComponent from '../../reusableComponents/loadingComponent';
import SimpleTooltipComponent from '../../reusableComponents/simpleTooltipComponent';

import './selectSportDialog.scss';

const numberOfLeaguesWarningMessage = 30;

export interface SelectSportDialogProps {
    isOpen: boolean;

    tooltipType: ActionResultEnum;
    tooltipMessage: React.ReactNode;

    triggerTooltip(tooltipType: ActionResultEnum, msg?: React.ReactNode): void;
    closeDialog(): void;
}

const mapStateToProps = (state: RootReducerState): Partial<SelectSportDialogProps> => {
    return {
        tooltipType: state.actionsResultReducer.actionResultTooltip,
        tooltipMessage: state.actionsResultReducer.actionResultTooltipMessage,
        isOpen: state.sportsModeReducer.isSelectSportDialogOpen,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<SelectSportDialogProps> => {
    return {
        closeDialog: () => dispatch(toggleIsSportDialogOpen(false)),
        triggerTooltip: (tooltipType: ActionResultEnum, msg?: React.ReactNode) =>
            dispatch(triggerActionResultTooltip(tooltipType, msg)),
    };
};

const selectSportDialog = (props: SelectSportDialogProps) => {
    const [ availableLeagues, setAvailableLeagues ] = React.useState<Array<SportLeagueModel> | undefined>();
    const [ collectingLeagues, setCollectingLeagues ] = React.useState<Array<SportLeagueModel> | undefined>();
    const [ currentCollectingState, setCurrentCollectingState ] = React.useState<Array<SportLeagueModel> | undefined>();

    const [ isLoading, setIsLoading ] = React.useState<boolean>(false);

    const [ typingValue, setTypingValue ] = React.useState<string | undefined>();
    const [ filteredValues, setFilteredValues ] = React.useState<Array<SportLeagueModel> | undefined>();

    // sorting function for available leagues
    const sortingFunction = useCallback((x: SportLeagueModel, y: SportLeagueModel) => {
        if (x.sport >= y.sport) {
            return 1;
        } else if (x.sport < y.sport) {
            return -1;
        }
    }, []);

    // when dialog opens / closes
    useEffect(() => {
        if (props.isOpen) {
            communication.sendMessageToBackgroundPage({
                type: BackgroundMessageTypeEnum.SportsApiFetch,
                data: {
                    type: SportsApiRequestType.GetLeaguesInSports,
                },
            }, (res) => setAvailableLeagues(res.sort(sortingFunction)));

            communication.sendMessageToBackgroundPage({
                type: BackgroundMessageTypeEnum.LoadStorageLocal,
                data: StorageLocalKeys.SelectedSports,
            }, (res) => { setCollectingLeagues(res); setCurrentCollectingState(res); });
        }
    }, [props.isOpen]);

    const closeDialog = () => {
        if (collectingLeagues?.length && currentCollectingState?.length) {
            const isStateEqual = arrayDeepEqual<SportLeagueModel>(
                    collectingLeagues,
                    currentCollectingState,
                    ['sport', 'leagueId'],
                );

            if (!isStateEqual) {
                communication.sendMessageToBackgroundPage({
                    type: BackgroundMessageTypeEnum.SetStorageLocal,
                    data: {
                        type: StorageLocalKeys.SelectedSports,
                        data: collectingLeagues,
                    },
                }, () => props.triggerTooltip(ActionResultEnum.Saved, actionResultsStrings.addSport.saved));
            }

            setAvailableLeagues(undefined);
            setCollectingLeagues(undefined);
        }

        props.closeDialog();
    };

    const renderLeagueItem = useCallback((league: SportLeagueModel) => {
        const handleOnCheckboxChange = (val: boolean) => {
            if (val) {
                if ((collectingLeagues!.length + 1 ) > numberOfLeaguesWarningMessage) {
                    props.triggerTooltip(
                        ActionResultEnum.SelectLeagues,
                        sportEndingsComponentStrings.loadingTime,
                    );
                }
                setCollectingLeagues([...collectingLeagues!, league]);
            } else {
                if ((collectingLeagues!.length -  1) <= numberOfLeaguesWarningMessage) {
                    props.triggerTooltip(ActionResultEnum.None);
                }
                setCollectingLeagues(collectingLeagues?.filter((lg) => lg.leagueId !== league.leagueId));
            }
        };

        return (
            <CheckboxComponent
                checkboxClassname={'select-sport-checkbox'}
                checked={!!collectingLeagues?.find((lg) => lg.leagueId === league.leagueId)}
                label={league.name}
                handleOnCheckboxChange={handleOnCheckboxChange}
            />
        );
    }, [collectingLeagues, setCollectingLeagues, props.triggerTooltip, props.tooltipType]);

    const renderFilteredList = () => {
        const includedSports = new Array<SportsEnum>();
        return (
            <>
                {filteredValues!.map((l) => {
                    let renderSportLabel = false;
                    if (!includedSports.includes(l.sport)) {
                        includedSports.push(l.sport);
                        renderSportLabel = true;
                    }

                    return (
                        <>
                            {renderSportLabel &&
                                <div className={'sports-label-select-league-dialog'}>{sportsLabel[l.sport]}</div>}
                            {renderLeagueItem(l)}
                        </>
                    );
                })}
            </>
        );
    };

    const renderAllLeagues = () => {
        const groupedBySport: { [sport: string]: string } = groupBy(availableLeagues, 'sport');

        return (
            <>
                {Object.keys(groupedBySport).map((sp) => {
                    const sport = parseInt(sp) as SportsEnum;
                    return (
                        <details open className={'details'}>
                            <summary className={'sports-label-select-league-dialog hoverable'}>
                                {sportsLabel[sport]}
                            </summary>
                            {availableLeagues?.filter((l) => l.sport === sport).map(renderLeagueItem)}
                        </details>
                    );
                })}
            </>
        );
    };

    const closeButtonRef = React.useRef<any>();
    const customDialogFooter = () => {
        const { tooltipMessage, tooltipType } = props;

        return (
            <>
                <SimpleTooltipComponent
                    content={tooltipMessage}
                    isOpen={false}
                    position={'top'}
                    trigger={tooltipType === ActionResultEnum.SelectLeagues ? 'hover' : 'manual'}
                    parentRef={closeButtonRef}
                    tooltipClassname={'info-tooltip'}
                >
                    <button
                        ref={closeButtonRef}
                        onClick={closeDialog}
                        className={'button-base tile clickable override-button-style margin-left-auto'}
                    >close</button>
                </SimpleTooltipComponent>
            </>
        );
    };

    const onChange = (e) => {
        const value: string = e.target.value;
        setTypingValue(value);

        if (value.length > 1) {
            setIsLoading(true);
        }

        onChangeWithDebounce(value);
    };

    const onChangeWithDebounce = useCallback(
        debounce((value: string) => {
            if (!value || !value.length) {
                setIsLoading(false);
                setFilteredValues(undefined);
                return;
            }

            const filtered = availableLeagues!
                .filter((l) => l.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()));

            setFilteredValues(filtered);
            setIsLoading(false);
        }, 500)
    , [availableLeagues, setFilteredValues, setIsLoading]);

    return (
        <Dialog
            isOpen={props.isOpen}
            customFooter={customDialogFooter()}
            closeButtonText={'save'}
        >
            {(availableLeagues === undefined || collectingLeagues === undefined) ?
                <LoadingComponent /> :
                <div>
                    <input
                        type={'text'}
                        className={'input-style select-sport-input'}
                        value={typingValue}
                        onChange={onChange}
                        placeholder={'Search available leagues'}
                    />
                    {isLoading
                        ? <LoadingComponent />
                        : (filteredValues !== undefined)
                            ? (filteredValues.length
                                ? renderFilteredList()
                                :   <div className={'center-vertically select-sport-button no-result'}>
                                        {sportEndingsComponentStrings.noResults}
                                    </div>)
                            : (availableLeagues.length > 0
                                    ? renderAllLeagues()
                                    : <div className={'center-vertically select-sport-button no-result'}>
                                        {sportEndingsComponentStrings.failedFetch}
                                      </div>)}
                </div>
            }
        </Dialog>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(selectSportDialog);
