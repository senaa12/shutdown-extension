import { countdownStrings, RootReducerState } from 'common';

import React from 'react';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import TimeInput from '../reusableComponents/timeInput';

import './countdownComponent.scss';

export interface CountdownComponentProps {
    inputSelectedTime: string;
    isShutdownScheduled: number;
    changeInputTime(newTime: string): void;
}

const mapStateToProps = (state: RootReducerState): Partial<CountdownComponentProps> => {
    return {
        inputSelectedTime: state.appReducer.inputSelectedTime,
        isShutdownScheduled: state.appReducer.isShutdownEventScheduled,
    };
};

const dispatchStateToProps = (dispatch: Dispatch): Partial<CountdownComponentProps> => {
    return {
        changeInputTime: (newTime: string) => dispatch(changeTimeSelected(newTime)),
    };
};

class CountdownComponent extends React.Component<CountdownComponentProps> {
    constructor(props: CountdownComponentProps) {
        super(props);
    }

    public render() {
        return (
            <div className='countdown-component'>
                <>{countdownStrings.description}</>
                <TimeInput
                    disabled={!!this.props.isShutdownScheduled}
                    value={this.props.inputSelectedTime}
                    onChange={this.props.changeInputTime}
                    fontSize={30}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(CountdownComponent);
