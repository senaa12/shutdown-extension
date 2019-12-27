import React from 'react';
import Icon from '../icon/icon';
import { IconEnum, IconSize } from '../icon/iconEnum';

import './header.scss';

export interface HeaderProps {

}

const header = (props: HeaderProps) => {
    return(
        <div className='header'>
            <div className='title'>SHUTDOWN EXTENSION</div>
            <Icon iconName={IconEnum.Logo} iconSize={IconSize.Normal} />
        </div>
    );
};

export default header;
