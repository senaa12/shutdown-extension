import React from 'react';
import Icon from '../icon/icon';
import { IconEnum } from '../icon/iconEnum';

import './buttonComponent.scss';

export interface CustomButtonProps {
    label: string;
    isSelected: boolean;
    onClick(): void;
    icon: IconEnum;
    className: string;
}

const buttonComponent = (props: CustomButtonProps) => {
    let className = 'button-base ' + props.className;
    className += props.isSelected ? ' selected' : '';
    return(
        <div
            className={className}
            onClick={props.onClick}
        >
            <div>
                <Icon
                    iconName={props.icon}
                />
            </div>
            <div>{props.label}</div>
        </div>
    );
};

export default buttonComponent;
