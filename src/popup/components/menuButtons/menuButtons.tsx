import { ApplicationModeEnum, convertSecondsToTimeFormat, initialTime, isShutdownScheduledSelector, RootReducerState } from 'common';
import { stat } from 'fs';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { changeAppState } from '../../actions/actions';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';

import './menuButtons.scss';

export interface MenuButtonsProps {
    selectedMode: ApplicationModeEnum;
    isHostAppActive: boolean;
    isShutdownScheduled: boolean;
    videoDuration?: number;
    changeSelectedMode(newMode: ApplicationModeEnum, newInputValue?: string): any;
}

const mapStateToProps = (state: RootReducerState, ownProps: any): Partial<MenuButtonsProps> => {
    return {
        selectedMode: state.appReducer.selectedApplicationMode,
        videoDuration: state.activeTabReducer.videoDuration,
        isShutdownScheduled: isShutdownScheduledSelector(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<MenuButtonsProps> => {
    return {
       changeSelectedMode: (newMode: ApplicationModeEnum, newInputValue?: string) => dispatch(changeAppState(newMode, newInputValue)),
    };
};

const MenuButtons: React.FunctionComponent<MenuButtonsProps> = (props) => {
    const onButtonClickCallback = React.useCallback((mode: ApplicationModeEnum) =>
        () => {
            const newInputValue = mode === ApplicationModeEnum.VideoPlayer 
                ? convertSecondsToTimeFormat(props.videoDuration, true) 
                : initialTime;

            props.changeSelectedMode(mode, newInputValue);
        }, [props.videoDuration]);

    return(
        <div className='menu-buttons-wrapper'>
            <ButtonComponent
                isSelected={props.selectedMode === ApplicationModeEnum.VideoPlayer}
                label={'Video Player'}
                onClick={onButtonClickCallback(ApplicationModeEnum.VideoPlayer)}
                icon={IconEnum.VideoPlayer}
                className={'tile custom-button'}
                iconSize={IconSize.Normal}
                disabled={props.isShutdownScheduled}
            />
            <ButtonComponent
                isSelected={props.selectedMode === ApplicationModeEnum.Timer}
                label={'Timer'}
                onClick={onButtonClickCallback(ApplicationModeEnum.Timer)}
                icon={IconEnum.AlarmClock}
                className={'tile custom-button'}
                iconSize={IconSize.Normal}
                disabled={props.isShutdownScheduled}
            />
            <ButtonComponent
                isSelected={props.selectedMode === ApplicationModeEnum.Countdown}
                label={'Countdown'}
                onClick={onButtonClickCallback(ApplicationModeEnum.Countdown)}
                icon={IconEnum.Countdown}
                className={'tile custom-button'}
                disabled={props.isShutdownScheduled}
            />
            <ButtonComponent
                isSelected={props.selectedMode === ApplicationModeEnum.SportEvent}
                label={'Sports'}
                onClick={onButtonClickCallback(ApplicationModeEnum.SportEvent)}
                icon={IconEnum.Sports}
                className={'tile custom-button'}
                disabled={props.isShutdownScheduled}
            />
            <div className={'triggers-label'}>{'Choose Trigger'}</div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuButtons);
