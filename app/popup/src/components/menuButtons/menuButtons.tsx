import { ApplicationModeEnum, RootReducerState, videoPlayerPremiumInfo } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { changeAppState } from '../../actions/actions';
import appProperties from '../../utilities/appProperties';
import { IconEnum, IconSize } from '../icon/iconEnum';
import ButtonComponent from '../reusableComponents/buttonComponent';
import SimpleTooltipComponent from '../reusableComponents/simpleTooltipComponent';

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

    private renderVideoButton = () => (
        appProperties.isBaseApp ?
        <SimpleTooltipComponent
            content={videoPlayerPremiumInfo}
            trigger={'hover'}
            wrapperClassname={'custom-button'}
            position={'bottom'}
        >
            <ButtonComponent
                isSelected={false}
                label={'Video Player'}
                icon={IconEnum.VideoPlayer}
                className={'fixer-class'}
                iconSize={IconSize.Normal}
                disabled={true}
            />
        </SimpleTooltipComponent> :
        <ButtonComponent
            isSelected={this.props.selectedMode === ApplicationModeEnum.VideoPlayer}
            label={'Video Player'}
            onClick={!this.props.isShutdownScheduled ?
                () => this.props.changeSelectedMode(ApplicationModeEnum.VideoPlayer) : () => {}}
            icon={IconEnum.VideoPlayer}
            className={'custom-button clickable'}
            iconSize={IconSize.Normal}
            disabled={this.props.isShutdownScheduled}
        />
    )

    private renderTimerButton = () => (
        <ButtonComponent
            isSelected={this.props.selectedMode === ApplicationModeEnum.Timer}
            label={'Timer'}
            onClick={!this.props.isShutdownScheduled ?
                () => this.props.changeSelectedMode(ApplicationModeEnum.Timer) : () => {}}
            icon={IconEnum.AlarmClock}
            className={'custom-button clickable'}
            iconSize={IconSize.Normal}
            disabled={this.props.isShutdownScheduled}
        />
    )

    private renderCountdownButton = () => (
        <ButtonComponent
            isSelected={this.props.selectedMode === ApplicationModeEnum.Countdown}
            label={'Countdown'}
            onClick={!this.props.isShutdownScheduled ?
                () => this.props.changeSelectedMode(ApplicationModeEnum.Countdown) : () => {}}
            icon={IconEnum.Countdown}
            className={'custom-button clickable'}
            disabled={this.props.isShutdownScheduled}
        />
    )

    public render() {
        return(
            <div className='menu-buttons-wrapper'>
                {this.renderVideoButton()}
                {this.renderTimerButton()}
                {this.renderCountdownButton()}
                <div className={'triggers-label'}>{'Choose Trigger'}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButtons);
