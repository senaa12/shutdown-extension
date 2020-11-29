import classNames from 'classnames';
import React, { useCallback } from 'react';
import Icon from '../icon/icon';
import { IconEnum } from '../icon/iconEnum';

import './checkboxComponent.scss';

interface CheckboxProps {
    checkboxClassname?: string;
    labelClassname?: string;
    disabled?: boolean;
    label?: React.ReactNode;
    checked?: boolean;
    style?: React.CSSProperties;
    handleOnCheckboxChange?: (value: any) => void;
}

const CheckboxComponent = React.forwardRef(({
    checked, disabled, handleOnCheckboxChange, label, labelClassname, checkboxClassname, style,
}: CheckboxProps,                           ref: any) => {
    const checkboxOnClick = useCallback(() => {
        if (!disabled && handleOnCheckboxChange) {
            handleOnCheckboxChange(!checked);
        }
    }, [checked, disabled, handleOnCheckboxChange]);

    const checkboxclassname = classNames('checkbox-base', checkboxClassname, {
        'disabled-checkbox': disabled,
    });
    const labelclassname = classNames('label-base', labelClassname, {
        checked,
    });

    return (
        <div
            ref={ref}
            style={style}
            className={checkboxclassname}
        >
            <label className={labelclassname} onClick={checkboxOnClick}>
                {checked && <div className={'icon-span'}>
                    <Icon iconName={IconEnum.Correct} iconSize={12} />
                </div>}
                <span className={'span'}>{label}</span>
            </label>
        </div>
    );
});

export default CheckboxComponent;
