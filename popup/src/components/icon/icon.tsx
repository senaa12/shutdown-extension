import classNames from 'classnames';
import React from 'react';
import { IconEnum, IconSize } from './iconEnum';

export interface IconProps {
    iconName: IconEnum;
    className?: string;
    iconSize?: IconSize | number;
    style?: React.CSSProperties;
}

const icon = (props: IconProps) => {
    React.useEffect(() => {
        try {
            require(`../../assets/icons/${props.iconName}.svg`);
        } catch (ex) {
            // tslint:disable-next-line:no-console
            console.error(ex);
        }
    }, []);

    const className = classNames(props.iconName, props.className);
    return(
        <svg
            className={className}
            height={props.iconSize ? props.iconSize : IconSize.Small}
            width={props.iconSize ? props.iconSize : IconSize.Small}
            style={props.style}
        >
            <use xlinkHref={`#${props.iconName}`} />
        </svg>
    );
};

export default icon;
