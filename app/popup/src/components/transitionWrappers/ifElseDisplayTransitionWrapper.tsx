import React from 'react';

export interface IfElseDisplayTransitionWrapperProps {
    shouldShowIfComponent: boolean;
    ifComponent: React.ReactNode;
    elseComponent: React.ReactNode;
}

export default class IfElseDisplayTransitionWrapper extends React.Component<IfElseDisplayTransitionWrapperProps> {
    constructor(props: IfElseDisplayTransitionWrapperProps) {
        super(props);
    }

    public render() {
        const { shouldShowIfComponent, ifComponent, elseComponent } = this.props;

        if (shouldShowIfComponent) {
            return ifComponent;
        }

        return elseComponent;
    }
}
