import { ApplicationModeEnum, RootReducerState, TabState } from 'common';
import React from 'react';
import { connect } from 'react-redux';
import ButtonComponent from '../buttonComponent/buttonComponent';
import { IconEnum } from '../icon/iconEnum';

import { AppOwnProps } from '../app';
import './actionButtons.scss';

export interface ActionButtonCustomProps {
    appMode: ApplicationModeEnum;
    isEventSubscribed: boolean;
}

declare type ActionButtonProps = ActionButtonCustomProps & TabState;

const mapStateToProps = (state: RootReducerState, ownProps: AppOwnProps): Partial<ActionButtonProps> => {
    const tabState = ownProps.currentTabId ? state.openTabsReducer.tabs[ownProps.currentTabId] : {};
    return {
        appMode: state.appReducer.selectedApplicationMode,
        isEventSubscribed: state.appReducer.isEventSubscibed,
        ...tabState,
    };
};

class ActionButtons extends React.Component<ActionButtonProps> {
    constructor(props: ActionButtonProps) {
        super(props);
    }

    public render() {
        return(
            <div className='action-buttons-container'>
                <ButtonComponent
                    isSelected={false}
                    className={'action-button clickable'}
                    label={'Shutdown'}
                    onClick={() => {}}
                    icon={IconEnum.PowerButton}
                />
                <ButtonComponent
                    isSelected={false}
                    className={'action-button clickable'}
                    label={'Cancel'}
                    onClick={() => {}}
                    icon={IconEnum.Cancel}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(ActionButtons);
