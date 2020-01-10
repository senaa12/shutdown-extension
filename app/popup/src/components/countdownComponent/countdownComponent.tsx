import { countdownStrings, RootReducerState } from 'common';

import React from 'react';
import { connect } from 'react-redux';

import { Dispatch } from 'redux';
import { changeTimeSelected } from '../../actions/actions';
import InputTimeComponent from '../reusableComponents/inputTimeComponent';
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

    private renderInputTimeComponent = () => {
        if (this.props.isShutdownScheduled) {
            return(
                <InputTimeComponent
                    isDisabled={true}
                    value={this.props.inputSelectedTime}
                />
            );
        } else {
            return (
                <InputTimeComponent
                    value={this.props.inputSelectedTime}
                    onChange={this.props.changeInputTime}
                />
            );
        }
    }

    public render() {
        return (
            <div className='countdown-component'>
                <>{countdownStrings.description}</>
                {this.renderInputTimeComponent()}
            </div>
        );
    }
}

export default connect(mapStateToProps, dispatchStateToProps)(CountdownComponent);
