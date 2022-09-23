import { title } from 'common';
import React from 'react';

import './header.scss';

const header = () => {
    return(
        <div className='header'>
            <div className='title'>{title}</div>
            <img src={'./logo-128.png'} height={32} width={32} />
        </div>
    );
};

export default header;
