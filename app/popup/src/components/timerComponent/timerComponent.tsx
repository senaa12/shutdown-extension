import React from 'react';

import { formatDate, RootReducerState, timerComponentStrings } from 'common';
import { connect } from 'react-redux';

import InputTimeComponent from '../reusableComponents/inputTimeComponent';

import { Dispatch } from 'redux';
import { changeSelectedDate, changeTimeSelected } from '../../actions/actions';
import './timerComponent.scss';

export interface TimerComponentProps {
    isShutdownScheduled: boolean;
    selectedInputTime: Date;
    changeSelectedInputTime(newVal: string): void;
    changeSelectedDate(newVal: string): void;
}

export interface TimerComponentState {
    currentTime: Date;
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
        changeSelectedDate: (newDate: string) => dispatch(changeSelectedDate(newDate)),
    };
};

class TimerComponent extends React.Component<TimerComponentProps, TimerComponentState> {
    constructor(props: TimerComponentProps) {
        super(props);
        this.state = {
            currentTime: new Date(),
        };
        setInterval(() => this.setState({ currentTime: new Date() }), 1000);
    }

    private setDate = (e) => {
        this.props.changeSelectedDate(e.target.value);
    }

    public renderContent = () => {
        if (!this.props.isShutdownScheduled) {
            return (
            <>{timerComponentStrings.description(<InputTimeComponent
                value={this.state.currentTime.toLocaleTimeString('hr-HR')}
                wrapperClassName={'time-fix'}
                isDisabled={true}
                fontSize={14}
            />)}
            <InputTimeComponent
                value={new Date(this.props.selectedInputTime).toLocaleTimeString('hr-HR').split(' ')[0]}
                onChange={this.props.changeSelectedInputTime}
                isDisabled={false}
                fontSize={25}
                maxValue={'23:59:59'}
            />
            <input
                type='date'
                className='custom-date custom-time-input'
                value={formatDate(this.props.selectedInputTime)}
                min={formatDate(new Date())}
                onChange={this.setDate}
            /></>);
        } else {
            return (<div className='timer-result'>
            <InputTimeComponent
                value={new Date(this.props.selectedInputTime).toLocaleTimeString('hr-HR').split(' ')[0]}
                isDisabled={true}
                fontSize={25}
                maxValue={'23:59:59'}
                label={'Shutdown scheduled at:'}
                labelPosition={'TOP'}
            />
            <input
                type='date'
                className='custom-date custom-time-input disabled'
                value={formatDate(this.props.selectedInputTime)}
                disabled={true}
            />
            </div>);
        }
    }

    public render() {
        return (
            <div className={'timer-component'}>
                {this.renderContent()}
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(TimerComponent);
