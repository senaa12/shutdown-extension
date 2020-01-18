import React from 'react';

import { RootReducerState } from 'common';
import { connect } from 'react-redux';

import InputTimeComponent from '../reusableComponents/inputTimeComponent';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import './timerComponent.scss';

export interface TimerComponentProps {
    isShutdownScheduled: boolean;
    selectedInputTime: string;
    changeSelectedInputTime(newVal: string): void;
}

export interface TimerComponentState {
    currentTime: Date;
    selectedDate: Date;
}

const mapStateToProps = (state: RootReducerState): Partial<TimerComponentProps> => {
    return {
        isShutdownScheduled: !!state.appReducer.isShutdownEventScheduled,
        selectedInputTime: state.appReducer.inputSelectedTime,
    };
};

const dispatchStateToProps = (dispatch: Dispatch): Partial<TimerComponentProps> => {
    return {
        changeSelectedInputTime: (newTime: string) => dispatch(changeTimeSelected(newTime)),
    };
};

class TimerComponent extends React.Component<TimerComponentProps, TimerComponentState> {
    constructor(props: TimerComponentProps) {
        super(props);
        this.state = {
            currentTime: new Date(),
            selectedDate: new Date(),
        };
        setInterval(() => this.setState({ currentTime: new Date() }), 1000);
    }

    public render() {
        return (
            <div className={'timer-component'}>
                <InputTimeComponent
                    value={this.state.currentTime.toLocaleTimeString('hr-HR')}
                    isDisabled={true}
                    label={'Current time:'}
                    fontSize={15}
                    labelPosition={'TOP'}
                />
                <InputTimeComponent
                    value={this.props.selectedInputTime}
                    onChange={this.props.changeSelectedInputTime}
                    isDisabled={false}
                    label={'Target time:'}
                    fontSize={25}
                    labelPosition={'TOP'}
                    maxValue={'23:59:59'}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(TimerComponent);
