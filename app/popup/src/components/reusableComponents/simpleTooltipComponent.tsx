import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
            (parentRef.current as unknown as HTMLElement).addEventListener('mouseover', () => setIsOpen(true));
            (parentRef.current as unknown as HTMLElement).addEventListener('mouseleave',
                () => setTimeout(hideTooltip, 100));
        }
    }, [props.trigger, parentRef.current] );

    // maual triggering
    useEffect(() => {
        if (props.trigger === 'manual' && props.isOpen !== undefined) {
            if (props.isOpen) {
                setIsOpen(true);
            } else {
                setTimeout(hideTooltip, 2300);
            }
        }
    }, [props.isOpen]);

    // first render
    useEffect(() => {
        if (forceRerender) { disableRerender(false); }
    }, [forceRerender]);

    // position calculation
    const calculatePosition = (): React.CSSProperties => {
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
        if (!isOpen) {
            return {
                ...hidden,
                top: renderedTooltiop.top,
                left: renderedTooltiop.left,
            };
        }

        return {
            position: 'absolute',
            opacity: 1,
            left: parentPosition.left + (parentPosition.width / 2) - (renderedTooltiop.width / 2),
            top: parentPosition.top - (renderedTooltiop.height) + 10,
        } as React.CSSProperties;
    };

    return (
    <>
        <div ref={parentRef} className={props.wrapperClassname}>{props.children}</div>
        {(isOpen || transitionInProgress) &&
            <div
                ref={tooltipRef}
                style={calculatePosition()}
                onTransitionEnd={setTransitionToFalse}
                className={props.tooltipClassname + ' tooltip-base'}
            >
                    <div className={'content'}>{props.content}</div>
                    <Icon iconName={IconEnum.Arrow} iconSize={IconSize.Smallest} className={'tooltip-arrow'} />
            </div>
        }
    </>);
};

export default simpleTooltipComponent;
