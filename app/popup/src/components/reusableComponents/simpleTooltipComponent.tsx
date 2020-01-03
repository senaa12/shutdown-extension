import React, { useEffect, useMemo, useRef, useState } from 'react';

import Icon from '../icon/icon';
import { IconEnum, IconSize } from '../icon/iconEnum';
import './simpleTooltipComponent.scss';

export interface TooltipComponentProps {
    content: React.ReactNode;
    tooltipClassname?: string;
    isOpen?: boolean;
    trigger?: 'hover' | 'manual';
    id: string;
    tooltipStyle?: React.CSSProperties;
}

type PropsWithChildren<P> = P & { children: React.ReactNode };

const simpleTooltipComponent = (props: PropsWithChildren<TooltipComponentProps>) => {
    const [ forceRerender, disableRerender ] = useState(false);
    const [isOpen, setIsOpen] = useState<boolean>(props.isOpen !== undefined ? props.isOpen : false);

    // default trigger is hover
    useEffect(() => {
        if ((!props.trigger || props.trigger === 'hover') && tooltipRef.current) {
            document.getElementById(props.id)?.addEventListener('mouseover', () => setIsOpen(true));
            document.getElementById(props.id)?.addEventListener('mouseleave',
                () => setTimeout(() => setIsOpen(false), 100));
        }
    }, [props.trigger] );

    // maual triggering
    useEffect(() => {
        if (props.trigger === 'manual' && props.isOpen !== undefined) {
            if (props.isOpen) {
                setIsOpen(true);
            } else {
                setTimeout(() => setIsOpen(false), 2300);
            }
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (forceRerender) { disableRerender(false); }
    }, [forceRerender]);

    // position calculation
    const tooltipRef = useRef(null);
    const calculatePosition = (): React.CSSProperties => {
        const parentPosition = document.getElementById(props.id)?.getBoundingClientRect();
        const hidden: React.CSSProperties = {
            opacity: 0,
            position: 'absolute',
            pointerEvents: 'none',
        };

        if (!tooltipRef.current || !parentPosition) {
            // first render
            if (isOpen && !forceRerender) { disableRerender(true); }

            return hidden;
        }

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
        <div id={props.id}>{props.children}</div>
        <div id={props.id + ' content'} ref={tooltipRef} style={calculatePosition()} className={props.tooltipClassname + ' tooltip-base'}>
            <div className={'content'}>{props.content}</div>
            <Icon iconName={IconEnum.Arrow} iconSize={IconSize.Smallest} className={'tooltip-arrow'} />
        </div>
    </>);
};

export default simpleTooltipComponent;
