import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './dialogComponent.scss';

export interface DialogProps {
    isOpen: boolean;
    children: React.ReactNode;
    onClose(): void;
    dialogClassName?: string;
}

const dialog = ({ isOpen, children, onClose, dialogClassName }: DialogProps) => {
    const className = classNames('dialog', 'sport-event-select-dialog'); // custom

    return (
        <CSSTransition
            id={Math.round(Math.random() * 10000)}
            in={isOpen}
            timeout={150}
            unmountOnExit
            mountOnEnter
        >
            <div className='dialog-background'>
                <div className={className}>
                    <div className='dialog-content scrollbar'>
                        {children}
                    </div>
                    <div className='dialog-footer'>
                        <button
                            onClick={onClose}
                            className={'button-base tile clickable override-button-style'}
                        >close</button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
};

export default dialog;
