import classNames from 'classnames';
import { calculateSeconds, convertSecondsToTimeFormat } from 'common';
import React, { useEffect } from 'react';
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
    inputClassName?: string;
    style?: React.CSSProperties;
}

const timeDurationComponent = (props: TimeDurationComponentProps) => {
    const wrapperClassName = classNames(props.wrapperClassName, 'input-time-holder', 'flex-column', {
        'flex-column-reverse': props.labelPosition === 'BOTTOM',
    });
    const labelClassname = classNames(props.labelClassname, 'label');

    return (
        <div className={wrapperClassName} style={props.style}>
            {props.label && <div className={labelClassname}>{props.label}</div>}
            <TimeDurationInput
                value={props.value}
                onChange={props.onChange}
                fontSize={props.fontSize}
                maxValue={props.maxValue}
                disabled={props.isDisabled}
                className={props.inputClassName}
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
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [ value, setValue ] = React.useState(props.value);

    const [ initialRender, setInitialRender ] = React.useState(false);
    useEffect(() => {
        if (!initialRender) {
            setInitialRender(true);
        }
    }, [initialRender]);

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
        setValue(props.value);
    }, [props.value]);

    const detectArrows = (e) => {
        if (props.disabled) {
            return;
        }

        const select = e.currentTarget.selectionStart;
        if (e.key === 'ArrowLeft' && select !== 0) {
            // jedino back ne radi dobro
            inputRef.current!.selectionStart = select - 1;
            inputRef.current!.selectionEnd = select - 1;
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            setOnSelectVal(select);

            const newVal = value.substr(0, select) + '0' + value.substr(select + 1);
            if(props.onChange) {
                props.onChange(newVal);
            }
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
        if (onSelectVal !== undefined) {
            if (select === 3 || select === 6) {
                inputRef.current!.selectionStart = select - 1;
                inputRef.current!.selectionEnd = select - 1;
            } else if (select === 0) {
                inputRef.current!.selectionStart = 0;
                inputRef.current!.selectionEnd = 1;
            } else {
                inputRef.current!.selectionStart = select;
                inputRef.current!.selectionEnd = select + 1;
            }
            setOnSelectVal(undefined);
        } else if (select === 2 || select === 5) {
            // ako je kod ":" u ispisu broja
            inputRef.current!.selectionStart = select + 1;
            inputRef.current!.selectionEnd = select + 2;
        } else if (select === 8) {
            // ako je kraj inputa selektiran
            inputRef.current!.selectionStart = 7;
            inputRef.current!.selectionEnd = 8;
        } else {
            inputRef.current!.selectionEnd = select + 1;
        }
    };

    useEffect(() => {
        if (props.disabled) {
            inputRef.current!.selectionStart = 0;
            inputRef.current!.selectionEnd = 0;
        }
    }, [props.disabled]);

    const className = classNames('input-style', props.className, {
        disabled: props.disabled,
    });

    return (
        <input
            ref={inputRef}
            className={className}
            disabled={props.disabled}
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
