import classNames from 'classnames';
import React, { useMemo } from 'react';
import { IconEnum, IconSize } from './iconEnum';
import { getIconSrc } from './iconsMapper';

export interface IconProps {
    iconName: IconEnum;
    className?: string;
    iconSize?: IconSize | number;
    style?: React.CSSProperties;
}

const icon = (props: IconProps) => {
    const icon = useMemo(() => getIconSrc(props.iconName), [props.iconName]);
    const className = classNames(props.iconName, props.className);
    
    return(
        <svg
            viewBox={`${icon.viewBox}`}
            className={className}
            height={props.iconSize ? props.iconSize : IconSize.Small}
            width={props.iconSize ? props.iconSize : IconSize.Small}
            style={props.style}
        >
            <use xlinkHref={`#${icon.id}`} />
        </svg>
    );
};

export default icon;
