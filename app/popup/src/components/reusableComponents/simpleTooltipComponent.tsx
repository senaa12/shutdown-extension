import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../icon/icon';
import { IconEnum, IconSize } from '../icon/iconEnum';

import './simpleTooltipComponent.scss';

export interface TooltipComponentProps {
    content: React.ReactNode;
    tooltipClassname?: string;
    isOpen?: boolean;
    trigger?: 'hover' | 'manual';
    tooltipStyle?: React.CSSProperties;
    wrapperClassname?: string;
    position?: 'bottom' | 'top';
}

type PropsWithChildren<P> = P & { children: React.ReactNode };

const simpleTooltipComponent = (props: PropsWithChildren<TooltipComponentProps>) => {
    const [ forceRerender, disableRerender ] = useState(false);

    const [isOpen, setIsOpen] = useState<boolean>(props.isOpen !== undefined ? props.isOpen : false);
    const [transitionInProgress, setTransitionInProgress] = useState(false);
    const setTransitionToFalse = useCallback(() => setTransitionInProgress(false), []);
    const hideTooltip = useCallback(() => { setTransitionInProgress(true); setIsOpen(false); }, []);

    const parentRef = useRef(null);
    const tooltipRef = useRef(null);

    // default trigger is hover
    useEffect(() => {
        if ((!props.trigger || props.trigger === 'hover') && parentRef.current) {
            (parentRef.current as unknown as HTMLElement).addEventListener('mouseenter', () => setIsOpen(true));
            (parentRef.current as unknown as HTMLElement).addEventListener('mouseleave', hideTooltip);
        }
    }, [props.trigger, parentRef.current] );

    // maual triggering
    useEffect(() => {
        if (props.trigger === 'manual' && props.isOpen !== undefined) {
            if (props.isOpen) {
                setIsOpen(true);
            } else {
                setTimeout(hideTooltip, 1500);
            }
        }
    }, [props.isOpen]);

    // first render
    useEffect(() => {
        if (forceRerender) { disableRerender(false); }
    }, [forceRerender]);

    // position calculation
    const calculatePosition = (): Partial<React.CSSProperties> => {
        const hidden: React.CSSProperties = {
            opacity: 0,
            position: 'absolute',
            pointerEvents: 'none',
        };

        if (!tooltipRef.current || !parentRef.current) {
            // first render
            if (isOpen && !forceRerender) { disableRerender(true); }

            return hidden;
        }

        const parentPosition = (parentRef.current as unknown as HTMLElement).getBoundingClientRect();
        const renderedTooltiop = (tooltipRef.current as unknown as HTMLElement).getBoundingClientRect();
        const currentStyle = (tooltipRef.current as unknown as HTMLElement).style;
        if (!isOpen) {
            return {
                ...hidden,
                top: !currentStyle.top ? renderedTooltiop.top : currentStyle.top,
                left: !currentStyle.left ? renderedTooltiop.left : currentStyle.left,
                display: currentStyle.display,
                flexDirection: props.position === 'bottom' ? 'column-reverse' : 'column',
            };
        }

        switch (props.position) {
            case 'bottom':
                return {
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    opacity: 1,
                    left: parentPosition.left + (parentPosition.width / 2) - (renderedTooltiop.width / 2),
                    top: parentPosition.bottom - 10,
                } as React.CSSProperties;
            case 'top':
            default:
                return {
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: 1,
                    left: parentPosition.left + (parentPosition.width / 2) - (renderedTooltiop.width / 2),
                    top: parentPosition.top - (renderedTooltiop.height) + 10,
                } as React.CSSProperties;
        }
    };

    const calculateIconPosition = () => {
        switch (props.position) {
            case 'bottom':
                return {
                    position: 'relative',
                    transform: 'rotate(180deg)',
                    top: 5,
                } as React.CSSProperties;
            case 'top':
            default:
                return {
                    position: 'relative',
                    bottom: 4,
                } as React.CSSProperties;
        }
    };

    const className = classNames(props.tooltipClassname, 'flex-column', 'tooltip-base');
    return (
    <>
        <div ref={parentRef} className={props.wrapperClassname}>{props.children}</div>
        {(isOpen || transitionInProgress) &&
            <div
                ref={tooltipRef}
                style={calculatePosition()}
                onTransitionEnd={setTransitionToFalse}
                className={className}
            >
                    <div className={' content'}>{props.content}</div>
                    <Icon
                        iconName={IconEnum.Arrow}
                        iconSize={IconSize.Smallest}
                        className={'tooltip-arrow'}
                        style={calculateIconPosition()}
                    />
            </div>
        }
    </>);
};

export default simpleTooltipComponent;
