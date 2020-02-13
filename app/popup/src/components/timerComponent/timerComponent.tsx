import React from 'react';

import { formatDate, RootReducerState, timerComponentStrings } from 'common';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { changeSelectedDateTime } from '../../actions/actions';
import './timerComponent.scss';

export interface TimerComponentProps {
    isShutdownScheduled: boolean;
    selectedInputDateTime: Date;
    changeSelectedDateTime(newVal: Date): void;
}

export interface TimerComponentState {
    currentTime: Date;
    selectedTime: string;
}

const mapStateToProps = (state: RootReducerState): Partial<TimerComponentProps> => {
    return {
        isShutdownScheduled: !!state.appReducer.isShutdownEventScheduled,
        selectedInputDateTime: state.appReducer.inputSelectedDateTime,
    };
};

const dispatchStateToProps = (dispatch: Dispatch): Partial<TimerComponentProps> => {
    return {
        changeSelectedDateTime: (newDate: Date) => dispatch(changeSelectedDateTime(newDate)),
    };
};

class TimerComponent extends React.Component<TimerComponentProps, TimerComponentState> {
    constructor(props: TimerComponentProps) {
        super(props);
        this.state = {
            currentTime: new Date(),
            selectedTime: new Date().toLocaleTimeString('hr-HR'),
        };
        setInterval(() => this.setState({ currentTime: new Date() }), 1000);
    }

    private setDate = (e) => {
        const newDate = new Date(e.target.value + ', ' + new Date(this.props.selectedInputDateTime).toTimeString());
        this.props.changeSelectedDateTime(newDate);
    }

    private setTime = (e) => {
        this.setState({ ...this.state, selectedTime: e.target.value });

        const newDate = new Date(new Date(this.props.selectedInputDateTime).toDateString() + ', ' + e.target.value);
        this.props.changeSelectedDateTime(newDate);
    }

    public render() {
        const { selectedInputDateTime, isShutdownScheduled } = this.props;

        return (
            <div className={'flex-column timer-component'}>
                {!isShutdownScheduled ?
                timerComponentStrings.description(
                    <input
                        type='time'
                        className='input-style'
                        value={this.state.currentTime.toLocaleTimeString('hr-HR')}
                        disabled={true}
                    />) :
                timerComponentStrings.scheduled()}
                <input
                    type='time'
                    step={1}
                    className={'custom-time input-style' + (isShutdownScheduled ? ' disabled' : '')}
                    value={this.state.selectedTime}
                    onChange={this.setTime}
                    disabled={isShutdownScheduled}
                />
                <input
                    type='date'
                    className={'custom-date input-style' + (isShutdownScheduled ? ' disabled' : '')}
                    value={formatDate(selectedInputDateTime)}
                    min={formatDate(new Date())}
                    onChange={this.setDate}
                    disabled={isShutdownScheduled}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(TimerComponent);
