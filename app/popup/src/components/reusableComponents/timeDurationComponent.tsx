import React from 'react';

import { calculateSeconds, convertSecondsToTimeFormat } from 'common';
import './timeDurationComponent.scss';

export interface TimeDurationComponentProps {
    value: string;
    onChange?(newValue: string): void;
    isDisabled?: boolean;
    maxValue?: string;
    label?: React.ReactNode;
    fontSize?: number;
    labelClassname?: string;
    labelPosition?: 'TOP' | 'BOTTOM';
    wrapperClassName?: string;
    style?: React.CSSProperties;
}

const timeDurationComponent = (props: TimeDurationComponentProps) => {
    const wrapperClassname = React.useMemo(() => (
        props.wrapperClassName + ' input-time-holder flex-column ' + (props.labelPosition === 'BOTTOM' ? 'flex-column-reverse' : '')
    ), [props.labelPosition, props.wrapperClassName]);

    const labelClassname = React.useMemo(() => (
        'label ' + (props.labelClassname ? props.labelClassname : '')
    ), [props.labelClassname]);

    return (
        <div className={wrapperClassname} style={props.style}>
            {props.label && <div className={labelClassname}>{props.label}</div>}
            <TimeDurationInput
                value={props.value}
                onChange={props.onChange}
                fontSize={props.fontSize}
                maxValue={props.maxValue}
                disabled={props.isDisabled}
            />
        </div>
    );
};

export interface TimeDurationInputProps {
    disabled?: boolean;
    value: string;
    onChange?: (newVal: string) => void;
    className?: string;
    maxValue?: string;
    minValue?: string;
    fontSize?: number;
}
// custom time input component
// because standard input time reads time format from computer
const TimeDurationInput = (props: TimeDurationInputProps) => {
    const inputRef = React.useRef(null);
    const [ value, setValue ] = React.useState(props.value);

    // used for correction on backspace
    const [ onSelectVal, setOnSelectVal ] = React.useState<undefined | number>(undefined);

    const minValue = React.useMemo(() => props.minValue ? props.minValue : ('00:00:00'), [props.minValue]);
    const maxValue = React.useMemo(() => props.maxValue ? props.maxValue : ('99:99:99'), [props.maxValue]);
    const width = React.useMemo(() =>
    ({
        fontSize: props.fontSize ?? 16,
        width: props.fontSize ? props.fontSize * 4.8 : 16 * 4.8,
    } as React.CSSProperties), [props.fontSize]);

    const prevetDefault = (e) => {
        if (props.disabled) {
            return;
        }
        e.preventDefault();
    };

    React.useEffect(() => {
        if (!props.onChange) {
            // ako nema postavljen onChange, a izvana se mjenja, tada promjeni vrijednost
            setValue(props.value);
        }
    }, [props.value]);

    const detectArrows = (e) => {
        if (props.disabled) {
            return;
        }

        const select = e.currentTarget.selectionStart;
        if (e.key === 'ArrowLeft' && select !== 0) {
            // jedino back ne radi dobro
            (inputRef.current as unknown as HTMLInputElement).selectionStart = select - 1;
            (inputRef.current as unknown as HTMLInputElement).selectionEnd = select - 1;
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            setOnSelectVal(select);

            const newVal = value.substr(0, select) + '0' + value.substr(select + 1);
            setValue(newVal);
        }
    };

    const onChange = (e) => {
        if (props.disabled) {
            return;
        }

        e.preventDefault();
        const time = calculateSeconds(e.target.value);

        if (!isNaN(time)) {
            const valueToSet = convertSecondsToTimeFormat(
                Math.max(calculateSeconds(minValue), Math.min(time, calculateSeconds(maxValue)),
            ), true) ?? minValue;

            setValue(valueToSet);
            if (props.onChange) {
                props.onChange(valueToSet);
            }
        }
    };

    const onSelect = (e) => {
        if (props.disabled) {
            return;
        }

        e.preventDefault();
        const select = onSelectVal ?? e.currentTarget.selectionStart;
        // backspace control
        if (onSelectVal) {
            if (select === 3 || select === 6) {
                (inputRef.current as unknown as HTMLInputElement).selectionStart = select - 1;
                (inputRef.current as unknown as HTMLInputElement).selectionEnd = select - 1;
            } else if (select === 0) {
                (inputRef.current as unknown as HTMLInputElement).selectionStart = 0;
                (inputRef.current as unknown as HTMLInputElement).selectionEnd = 1;
            } else {
                (inputRef.current as unknown as HTMLInputElement).selectionStart = select;
                (inputRef.current as unknown as HTMLInputElement).selectionEnd = select + 1;
            }
            setOnSelectVal(undefined);
        } else if (select === 2 || select === 5) {
            // ako je kod ":" u ispisu broja
            (inputRef.current as unknown as HTMLInputElement).selectionStart = select + 1;
            (inputRef.current as unknown as HTMLInputElement).selectionEnd = select + 2;
        } else if (select === 8) {
            // ako je kraj inputa selektiran
            (inputRef.current as unknown as HTMLInputElement).selectionStart = 7;
            (inputRef.current as unknown as HTMLInputElement).selectionEnd = 8;
        } else {
            (inputRef.current as unknown as HTMLInputElement).selectionEnd = select + 1;
        }
    };

    let className = 'input-style';
    className += props.disabled ? ' disabled' : '';

    return (
        <input
            ref={inputRef}
            className={className}
            style={width}
            type={'text'}
            maxLength={8}
            value={value}
            onChange={onChange}
            onSelect={onSelect}
            onKeyDown={detectArrows}
            onMouseMove={prevetDefault}
            onMouseMoveCapture={prevetDefault}
            onDoubleClick={prevetDefault}
            onDoubleClickCapture={prevetDefault}
        />
    );
};

export default timeDurationComponent;
