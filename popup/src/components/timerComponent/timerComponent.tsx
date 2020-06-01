import { formatDate, isShutdownScheduledSelector, RootReducerState, timerComponentStrings } from 'common';
import React from 'react';
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
    /**
     * don't know why but when changing input value through props (maybe something with async) it does not work well,
     * so this is just to set input value throught state
     */
    selectedDateTime: Date;
}

const mapStateToProps = (state: RootReducerState): Partial<TimerComponentProps> => {
    return {
        isShutdownScheduled: isShutdownScheduledSelector(state),
        selectedInputDateTime: new Date(state.appReducer.inputSelectedDateTimeString),
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
            selectedDateTime: props.isShutdownScheduled ? new Date(props.selectedInputDateTime) : new Date(),
        };

        setInterval(() => this.setState({ currentTime: new Date() }), 1000);
    }

    private setDate = (e) => {
        const newDate = new Date(e.target.value + ', ' + new Date(this.props.selectedInputDateTime).toTimeString());
        this.setState({ selectedDateTime: newDate }, () => this.props.changeSelectedDateTime(newDate));
    }

    private setTime = (e) => {
        const newDate = new Date(new Date(this.props.selectedInputDateTime).toDateString() + ', ' + e.target.value);
        this.setState({ selectedDateTime: newDate }, () => this.props.changeSelectedDateTime(newDate));
    }

    public render() {
        const { isShutdownScheduled } = this.props;
        const { currentTime, selectedDateTime } = this.state;

        return (
            <div className={'flex-column timer-component'}>
                {!isShutdownScheduled ?
                    timerComponentStrings.description(
                        <input
                            type='time'
                            className='input-style'
                            value={currentTime.toLocaleTimeString('hr-HR')}
                            disabled={true}
                        />) :
                    timerComponentStrings.scheduled()}
                <input
                    type='time'
                    step={1}
                    className={'input-style custom-time'}
                    value={selectedDateTime.toLocaleTimeString('hr-HR')}
                    onChange={this.setTime}
                    disabled={isShutdownScheduled}
                />
                <input
                    type='date'
                    className={'custom-date input-style'}
                    value={formatDate(selectedDateTime)}
                    min={new Date().toLocaleDateString()}
                    onChange={this.setDate}
                    disabled={isShutdownScheduled}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(TimerComponent);
