import React from 'react';
import { IconEnum, IconSize } from './iconEnum';

export interface IconProps {
    iconName: IconEnum;
    className?: string;
    iconSize?: IconSize;
}

const icon = (props: IconProps) => {
    React.useEffect(() => {
        try {
            require('../../assets/icons/' + props.iconName + '.svg');
        } catch (ex) {
            // tslint:disable-next-line:no-console
            console.error(ex);
        }
    }, []);

    return(
        <svg
            className={props.iconName + ' ' + props.className}
            height={props.iconSize ? props.iconSize : IconSize.Small}
            width={props.iconSize ? props.iconSize : IconSize.Small}
        >
            <use xlinkHref={`#${props.iconName}`} />
        </svg>
    );
};

export default icon;
