import { ApplicationModeEnum, RootReducerState } from 'common';
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
    changeSelectedMode(newMode: ApplicationModeEnum): void;
}

const mapStateToProps = (state: RootReducerState, ownProps: any): Partial<MenuButtonsProps> => {
    return {
        selectedMode: state.appReducer.selectedApplicationMode,
        isShutdownScheduled: !!state.appReducer.isShutdownEventScheduled,
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<MenuButtonsProps> => {
    return {
       changeSelectedMode: (newMode: ApplicationModeEnum) => dispatch(changeAppState(newMode)),
    };
};

class MenuButtons extends React.Component<MenuButtonsProps> {
    constructor(props: MenuButtonsProps) {
        super(props);
    }

    public render() {
        const { selectedMode, changeSelectedMode, isShutdownScheduled } = this.props;

        return(
            <div className='menu-buttons-wrapper'>
                <ButtonComponent
                    isSelected={selectedMode === ApplicationModeEnum.VideoPlayer}
                    label={'Video Player'}
                    onClick={!isShutdownScheduled ?
                        () => changeSelectedMode(ApplicationModeEnum.VideoPlayer) : () => {}}
                    icon={IconEnum.VideoPlayer}
                    className={'custom-button clickable'}
                    iconSize={IconSize.Normal}
                    disabled={isShutdownScheduled}
                />
                <ButtonComponent
                    isSelected={selectedMode === ApplicationModeEnum.Countdown}
                    label={'Countdown'}
                    onClick={!isShutdownScheduled ?
                        () => changeSelectedMode(ApplicationModeEnum.Countdown) : () => {}}
                    icon={IconEnum.Countdown}
                    className={'custom-button clickable'}
                    disabled={isShutdownScheduled}
                />
                <ButtonComponent
                    isSelected={selectedMode === ApplicationModeEnum.Timer}
                    label={'Clock'}
                    onClick={!isShutdownScheduled ?
                        () => changeSelectedMode(ApplicationModeEnum.Timer) : () => {}}
                    icon={IconEnum.AlarmClock}
                    className={'custom-button clickable'}
                    iconSize={IconSize.Normal}
                    disabled={isShutdownScheduled}
                />
                <div className={'triggers-label'}>{'Choose Trigger'}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButtons);
