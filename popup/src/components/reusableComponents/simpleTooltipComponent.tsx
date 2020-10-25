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
    position?: 'bottom' | 'top';
    /** in miliseconds, default is 1000, works only in Manual mode */
    tooltipHideAnimationDuration?: number;
    /** reference where you want tooltip to show */
    parentRef: React.RefObject<any>;
}

type PropsWithChildren<P> = P & { children: React.ReactNode };

const simpleTooltipComponent = (props: PropsWithChildren<TooltipComponentProps>) => {
    const [ forceRerender, disableRerender ] = useState(false);

    const [isOpen, setIsOpen] = useState<boolean>(props.isOpen !== undefined ? props.isOpen : false);
    const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(props.content);
    const [tooltipClassName, setTooltipClassName] = useState<string | undefined>(props.tooltipClassname);
    const [transitionInProgress, setTransitionInProgress] = useState(false);

    const setTransitionToFalse = () => {
        setTransitionInProgress(false);
        // first transition is when tooltip appears
        if (!isOpen) {
            setTooltipContent(undefined);
            setTooltipClassName(undefined);
        }
    };

    const hideTooltip = useCallback(() => {
        setTransitionInProgress(true);
        setIsOpen(false);
    }, []);

    const showTooltip = () => {
        setTooltipContent(props.content);
        setTooltipClassName(props.tooltipClassname);
        setIsOpen(true);
    };

    const tooltipRef = useRef<HTMLDivElement>(null);

    // default trigger is hover
    useEffect(() => {
        if ((!props.trigger || props.trigger === 'hover') && props.parentRef && props.parentRef.current) {
            props.parentRef.current.addEventListener('mouseenter', showTooltip);
            props.parentRef.current.addEventListener('mouseleave', hideTooltip);
        }
    }, [props.trigger, props.parentRef] );

    // maual triggering
    useEffect(() => {
        if (props.trigger === 'manual' && props.isOpen !== undefined) {
            if (props.isOpen) {
                showTooltip();
            } else {
                setTimeout(hideTooltip, props.tooltipHideAnimationDuration ?? 1000);
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

        if (!tooltipRef.current || !props.parentRef || !props.parentRef.current) {
            // first render
            if (isOpen && !forceRerender) { disableRerender(true); }

            return hidden;
        }

        const parentPosition = props.parentRef.current.getBoundingClientRect();
        const renderedTooltiop = tooltipRef.current.getBoundingClientRect();
        const currentStyle = tooltipRef.current.style;
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
                    top: parentPosition.bottom - 8,
                } as React.CSSProperties;
            case 'top':
            default:
                return {
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: 1,
                    left: parentPosition.left + (parentPosition.width / 2) - (renderedTooltiop.width / 2),
                    top: parentPosition.top - (renderedTooltiop.height) + 8,
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
                    bottom: 6,
                } as React.CSSProperties;
        }
    };

    const className = classNames(tooltipClassName, 'flex-column', 'tooltip-base');
    return (
    <>
        {props.children}
        {(isOpen || transitionInProgress) &&
            <div
                ref={tooltipRef}
                style={calculatePosition()}
                onTransitionEnd={setTransitionToFalse}
                className={className}
            >
                    <div className={'content'}>{tooltipContent}</div>
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
