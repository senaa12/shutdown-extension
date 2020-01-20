import React from 'react';

import './revealContentAnimationWrapper.scss';

export interface RevealContentAnimationWrapperProps {
    shouldShowChildren: boolean;
}

export interface RevealContentAnimationWrapperState {
    classNameTrigger: string;
}

// tslint:disable-next-line: max-line-length
export default class RevealContentAnimationWrapper extends React.Component<RevealContentAnimationWrapperProps, RevealContentAnimationWrapperState> {
    constructor(props: RevealContentAnimationWrapperProps) {
        super(props);
        this.state = { classNameTrigger: props.shouldShowChildren ? 'placeholder' : '' };
    }

    public componentDidUpdate(prevProps: RevealContentAnimationWrapperProps) {
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
