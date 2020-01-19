import React from 'react';

import './inputTimeComponent.scss';
import TimeInput from './timeInput';

export interface InputTimeComponentProps {
    value: string;
    onChange?(newValue: string): void;
    isDisabled?: boolean;
    maxValue?: string;
    label?: React.ReactNode;
    fontSize?: number;
    labelClassname?: string;
    labelPosition?: 'TOP' | 'BOTTOM';
    wrapperClassName?: string;
}

const inputTimeComponent = (props: InputTimeComponentProps) => {
    const wrapperClassname = React.useMemo(() => (
        props.wrapperClassName + ' input-time-holder ' + (props.labelPosition === 'BOTTOM' ? 'flex-column-reverse' : '')
    ), [props.labelPosition, props.wrapperClassName]);

    const labelClassname = React.useMemo(() => (
        'label ' + (props.labelClassname ? props.labelClassname : '')
    ), [props.labelClassname]);

    return (
        <div className={wrapperClassname}>
            {props.label && <div className={labelClassname}>{props.label}</div>}
            <TimeInput
                value={props.value}
                onChange={props.onChange}
                fontSize={props.fontSize}
                maxValue={props.maxValue}
                disabled={props.isDisabled}
            />
        </div>
    );
};

export default inputTimeComponent;
