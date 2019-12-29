import React from 'react';

import { calculateSeconds } from 'common';
import './inputTimeComponent.scss';

export interface InputTimeComponentProps {
    value: string;
    onChange?(newValue: string): void;
    isDisabled?: boolean;
    maxValue?: string;
    label?: React.ReactNode;
    labelClassname?: string;
    labelPosition?: 'LEFT' | 'BOTTOM';
}

const inputTimeComponent = (props: InputTimeComponentProps) => {
    const [ time, changeTime ] = React.useState(props.value);

    const onChange = (e) => {
        if (props.maxValue && calculateSeconds(props.maxValue) < calculateSeconds(e.target.value)) {
            changeTime(props.maxValue);
        } else {
            changeTime(e.target.value);
        }
    };

    React.useEffect(() => {
        if (props.onChange) {
            props.onChange(time.length < 7 ? time + ':00' : time);
        }
    }, [time]);

    const wrapperClassname = React.useMemo(() => (
        'input-time-holder ' + (props.labelPosition === 'BOTTOM' ? 'flex-column-reverse' : '')
    ), []);

    const labelClassname = React.useMemo(() => (
        'label ' + (props.labelClassname ? props.labelClassname : '')
    ), []);

    return (
        <div className={wrapperClassname}>
            {props.label && <div className={labelClassname}>{props.label}</div>}
            <input
                type={'time'}
                step={'1'}
                className={props.isDisabled ? 'time-selector disabled' : 'time-selector'}
                disabled={props.isDisabled}
                onChange={onChange}
                value={time}
            />
        </div>
    );
};

export default inputTimeComponent;
