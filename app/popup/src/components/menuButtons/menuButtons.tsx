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
    changeSelectedMode(newMode: ApplicationModeEnum): void;
}

const mapStateToProps = (state: RootReducerState, ownProps: any): Partial<MenuButtonsProps> => {
    return {
        selectedMode: state.appReducer.selectedApplicationMode,
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
        return(
            <div className='menu-buttons-wrapper'>
                <ButtonComponent
                    isSelected={this.props.selectedMode === ApplicationModeEnum.VideoPlayer}
                    label={'Video Player'}
                    onClick={() => this.props.changeSelectedMode(ApplicationModeEnum.VideoPlayer)}
                    icon={IconEnum.VideoPlayer}
                    className={'custom-button clickable'}
                    iconSize={IconSize.Normal}
                />
                <ButtonComponent
                    isSelected={this.props.selectedMode === ApplicationModeEnum.Countdown}
                    label={'Countdown'}
                    onClick={() => this.props.changeSelectedMode(ApplicationModeEnum.Countdown)}
                    icon={IconEnum.Countdown}
                    className={'custom-button clickable'}
                />
                <div className={'triggers-label'}>{'Choose Trigger'}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButtons);
