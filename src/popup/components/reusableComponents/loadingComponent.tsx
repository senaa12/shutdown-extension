import classNames from 'classnames';
import React from 'react';

import './loadingComponent.scss';

export interface LoadingProps {
    className?: string;
}

const loadingComponent = (props: LoadingProps) => {
    const className = classNames('la-ball-spin la-dark', props.className);

    return (
        <div className={className}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    );
};

export default loadingComponent;
