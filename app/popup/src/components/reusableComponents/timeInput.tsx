import React from 'react';

import { calculateSeconds, convertSecondsToTimeFormat } from 'common';
import './timeInput.scss';

export interface TimeInputProps {
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
const timeInput = (props: TimeInputProps) => {
    const inputRef = React.useRef(null);
    const [ value, setValue ] = React.useState(props.value);

    const minValue = React.useMemo(() => props.minValue ? props.minValue : ('00:00:00'), []);
    const maxValue = React.useMemo(() => props.maxValue ? props.maxValue : ('99:99:99'), []);
    const width = React.useMemo(() =>
    ({
        fontSize: props.fontSize ?? 16,
        width: props.fontSize ? props.fontSize * 4.8 : 16 * 4.8,
    } as React.CSSProperties), [props.fontSize]);

    const prevetDefault = (e) => { e.preventDefault(); };

    React.useEffect(() => {
        if (!props.onChange) {
            // ako nema postavljen onChange, a izvana se mjenja, tada promjeni vrijednost
            setValue(props.value);
        }
    }, [props.value]);

    const detectArrows = (e) => {
        const select = e.currentTarget.selectionStart;
        if (e.key === 'ArrowLeft' && select !== 0) {
            // jedino back ne radi dobro
            (inputRef.current as unknown as HTMLInputElement).selectionStart = select - 1;
            (inputRef.current as unknown as HTMLInputElement).selectionEnd = select - 1;
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            const newVal = value.substr(0, select) + '0' + value.substr(select + 1);
            setValue(newVal);
            (inputRef.current as unknown as HTMLInputElement).selectionStart = select - 1;
            (inputRef.current as unknown as HTMLInputElement).selectionEnd = select - 1;
        }
    };

    const onChange = (e) => {
        e.preventDefault();

        const proccesInput = (oldValues: string, newValues: string) => {
            const old = oldValues.split(':');
            const newV = newValues.split(':');

            const proccesed = newV.map((s, index) => {
                let returnVal;
                if (isNaN(Number(s)) || s === old[index]) {
                    returnVal = old[index];
                } else {
                    returnVal = Number(s).toString();
                    if (returnVal.length === 1) {
                        returnVal = '0' + returnVal;
                    }
                }
                if (index < 2) { returnVal += ':'; }
                return returnVal;
            }).join('');

            return convertSecondsToTimeFormat(
                Math.max(calculateSeconds(minValue), Math.min(calculateSeconds(proccesed), calculateSeconds(maxValue)),
                ), true);
        };
        setValue(proccesInput(value, e.target.value) ?? minValue);

        if (props.onChange) {
            props.onChange(value);
        }
    };

    const onSelect = (e) => {
        const select = e.currentTarget.selectionStart;
        if (select === 2 || select === 5) {
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

    let className = 'custom-time-input';
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

export default timeInput;
