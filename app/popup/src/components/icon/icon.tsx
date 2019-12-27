import React from 'react';
import { IconEnum, IconSize } from './iconEnum';

export interface IconProps {
    iconName: IconEnum;
    className?: string;
    iconSize?: IconSize;
}

const icon = (props: IconProps) => {
    const [ useTag, setUseTag ] = React.useState<string>('');

    React.useEffect(() => {
        try {
            const iconFile = require('../../assets/icons/' + props.iconName + '.svg');
            setUseTag('<use xlink:href="#' + iconFile.default.id + '\"></use>');
        } catch (ex) {
            // tslint:disable-next-line:no-console
            console.error(ex);
        }
    }, []);

    if (!useTag.length) {
        return null;
    }

    return(
        <svg
            className={props.iconName + ' ' + props.className}
            dangerouslySetInnerHTML={{ __html: useTag }}
            height={props.iconSize ? props.iconSize : IconSize.Small}
            width={props.iconSize ? props.iconSize : IconSize.Small}
        />
    );
};

export default icon;
