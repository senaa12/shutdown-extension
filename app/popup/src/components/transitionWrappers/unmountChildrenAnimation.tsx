import React from 'react';

import './unmountChildrenAnimation.scss';

export interface UnmountChildrenAnimationProps {
    shouldShowChildren: boolean;
}

export interface UnmountChildrenAnimationState {
    classNameTrigger: string;
}

// tslint:disable-next-line: max-line-length
export default class UnmountChildrenAnimation extends React.Component<UnmountChildrenAnimationProps, UnmountChildrenAnimationState> {
    constructor(props: UnmountChildrenAnimationProps) {
        super(props);
        this.state = { classNameTrigger: props.shouldShowChildren ? 'placeholder' : '' };
    }

    public componentDidUpdate(prevProps: UnmountChildrenAnimationProps) {
        if (prevProps.shouldShowChildren && !this.props.shouldShowChildren) {
            this.setState({ classNameTrigger: 'open' });
        }

        if (!prevProps.shouldShowChildren && this.props.shouldShowChildren) {
            this.setState({ classNameTrigger: 'placeholder' });
        }
    }

    public unmountChildren = () => {
        this.setState({ classNameTrigger: '' });
    }

    public render() {
        const { shouldShowChildren, children } = this.props;

        if (!shouldShowChildren && !this.state.classNameTrigger.length) {
            return null;
        }

        return (
            <div className={'wrapper ' + this.state.classNameTrigger} onTransitionEnd={this.unmountChildren}>
                <div className={'triangle left'}>{children}</div>
                <div className={'triangle right'}>{children}</div>
            </div>
        );
    }
}
