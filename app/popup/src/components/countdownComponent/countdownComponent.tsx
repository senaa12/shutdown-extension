import { calculateSeconds, countdownComponentStrings, RootReducerState } from 'common';

import React from 'react';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import InputTimeComponent from '../reusableComponents/inputTimeComponent';

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
        isShutdownScheduled: !!state.appReducer.isShutdownEventScheduled,
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
        return (
            <div className='countdown-component'>
                <InputTimeComponent
                    value={this.props.inputSelectedTime}
                    onChange={!this.props.isShutdownScheduled ?
                        this.props.changeInputTime :
                        undefined}
                    labelPosition={'TOP'}
                    label={this.props.isShutdownScheduled ?
                        countdownComponentStrings.scheduledString(this.state.intervalTimeInput) :
                        countdownComponentStrings.notScheduledDesciption}
                    labelClassname={'shutdown-label'}
                    fontSize={30}
                    isDisabled={this.props.isShutdownScheduled}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(CountdownComponent);
