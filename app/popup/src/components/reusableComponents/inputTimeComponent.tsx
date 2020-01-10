import React from 'react';

import './inputTimeComponent.scss';
import TimeInput from './timeInput';

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
    const wrapperClassname = React.useMemo(() => (
        'input-time-holder ' + (props.labelPosition === 'BOTTOM' ? 'flex-column-reverse' : '')
    ), []);

    const labelClassname = React.useMemo(() => (
        'label ' + (props.labelClassname ? props.labelClassname : '')
    ), []);

    return (
        <div className={wrapperClassname}>
            {props.label && <div className={labelClassname}>{props.label}</div>}
            <TimeInput
                value={props.value}
                onChange={props.onChange}
                fontSize={30}
                maxValue={props.maxValue}
            />
        </div>
    );
};

export default inputTimeComponent;
