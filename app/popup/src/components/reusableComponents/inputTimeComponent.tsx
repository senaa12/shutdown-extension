import React from 'react';

import './inputTimeComponent.scss';

export interface InputTimeComponentProps {
    value: string;
    onChange(newValue: string): void;
    isDisabled?: boolean;
}

const inputTimeComponent = (props: InputTimeComponentProps) => {
    const [ time, changeTime ] = React.useState(props.value);

    const onChange = (e) => {
        changeTime(e.target.value);
    };

    React.useEffect(() => {
        props.onChange(time);
    }, [time]);

    return (
        <input
            type='time'
            step='1'
            className={props.isDisabled ? 'time-selector disabled' : 'time-selector'}
            disabled={props.isDisabled}
            onChange={onChange}
            value={time}
        />
    );
};

export default inputTimeComponent;
