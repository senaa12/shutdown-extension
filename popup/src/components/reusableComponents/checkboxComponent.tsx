import classNames from 'classnames';
import { Console } from 'console';
import React, { useCallback } from 'react';
import Icon from '../icon/icon';
import { IconEnum } from '../icon/iconEnum';

import './checkboxComponent.scss';
import dialog from './dialogComponent';

interface CheckboxProps {
    checkboxClassname?: string;
    labelClassname?: string;
    disabled?: boolean;
    label?: React.ReactNode;
    checked?: boolean;
    handleOnCheckboxChange?: (value: any) => void;
}

const CheckboxComponent = ({
    checked, disabled, handleOnCheckboxChange, label, labelClassname, checkboxClassname,
}: CheckboxProps) => {
    const checkboxOnClick = useCallback(() => {
        if (!disabled && handleOnCheckboxChange) {
            handleOnCheckboxChange(!checked);
        }
    }, [checked, disabled, handleOnCheckboxChange]);

    const checkboxclassname = classNames('checkbox-base', checkboxClassname);
    const labelclassname = classNames('label-base', labelClassname, {
        checked,
        'disabled-checkbox': disabled,
    });

    return (
        <div
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
};

export default CheckboxComponent;
