import { calculateSeconds, countdownComponentStrings, isShutdownScheduledSelector, RootReducerState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import TimeDurationComponent from '../reusableComponents/timeDurationComponent';

import './countdownComponent.scss';

export interface CountdownComponentProps {
    inputSelectedTime: string;
    isShutdownScheduled: boolean;
    changeInputTime(newTime: string): void;
}

export interface CountdownComponentState {
    intervalTimeInput: string;
}

const mapStateToProps = (state: RootReducerState): Partial<CountdownComponentProps> => {
    return {
        inputSelectedTime: state.appReducer.inputSelectedTime,
        isShutdownScheduled: isShutdownScheduledSelector(state),
    };
};

const dispatchStateToProps = (dispatch: Dispatch): Partial<CountdownComponentProps> => {
    return {
        changeInputTime: (newTime: string) => dispatch(changeTimeSelected(newTime)),
    };
};

class CountdownComponent extends React.Component<CountdownComponentProps, CountdownComponentState> {
    constructor(props: CountdownComponentProps) {
        super(props);
        this.state = {
            intervalTimeInput: new Date().toLocaleTimeString(),
        };
    }

    public componentDidUpdate(prevProps: CountdownComponentProps) {
        if (prevProps.isShutdownScheduled !== this.props.isShutdownScheduled && this.props.isShutdownScheduled) {
                const shutdownAt = new Date();
                shutdownAt.setSeconds(shutdownAt.getSeconds() + calculateSeconds(this.props.inputSelectedTime));
                this.setState({ intervalTimeInput: shutdownAt.toLocaleTimeString() });
        }
    }

    public render() {
        const { inputSelectedTime, isShutdownScheduled, changeInputTime } = this.props;
        const { intervalTimeInput } = this.state;
        return (
            <div className='flex-column countdown-component'>
                <TimeDurationComponent
                    value={inputSelectedTime}
                    onChange={changeInputTime}
                    labelPosition={'TOP'}
                    label={isShutdownScheduled ?
                        countdownComponentStrings.scheduledString(intervalTimeInput) :
                        countdownComponentStrings.notScheduledDesciption}
                    labelClassname={'shutdown-label'}
                    fontSize={30}
                    isDisabled={isShutdownScheduled}
                    style={{ marginTop: 15 }}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(CountdownComponent);
