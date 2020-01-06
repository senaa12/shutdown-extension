import React from 'react';
import Icon from '../icon/icon';
import { IconEnum, IconSize } from '../icon/iconEnum';

import './buttonComponent.scss';

export interface CustomButtonProps {
    label: string;
    isSelected: boolean;
    onClick(): void;
    icon: IconEnum;
    className: string;
    tooltip?: string;
    iconSize?: IconSize;
    disabled?: boolean;
}

const buttonComponent = (props: CustomButtonProps) => {
    let className = 'button-base ' + props.className;
    className += props.isSelected ? ' selected' : '';
    className += props.disabled ? ' disabled' : '';
    return(
        <div
            title={props.tooltip}
            className={className}
            // tslint:disable-next-line: no-empty
            onClick={!props.disabled ? props.onClick : () => {}}
        >
            <div>
                <Icon
                    className={'button-icon'}
                    iconName={props.icon}
                    iconSize={props.iconSize}
                />
            </div>
            <div className={'label'}>{props.label}</div>
        </div>
    );
};

export default buttonComponent;
