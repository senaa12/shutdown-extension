import { RootReducerState } from 'common';
import { toggleIsSportDialogOpen } from '../../../actions/actions';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Dialog from '../../reusableComponents/dialogComponent';

import './selectSportDialog.scss';

export interface SelectSportDialogProps {
    isOpen: boolean;

    closeDialog(): void;
}

const mapStateToProps = (state: RootReducerState): Partial<SelectSportDialogProps> => {
    return {
        isOpen: state.sportsModeReducer.isSelectSportDialogOpen
    };
};

const mapDispatchToProps = (dispatch: Dispatch): Partial<SelectSportDialogProps> => {
    return {
        closeDialog: () => dispatch(toggleIsSportDialogOpen(false))
    };
};

const selectSportDialog = (props: SelectSportDialogProps) => {
    const closeDialog = () => {
        props.closeDialog();
    }

    return (
        <Dialog
            isOpen={props.isOpen}
            onClose={closeDialog}
        >
           <div>select sports you want to scan</div>     
        </Dialog>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(selectSportDialog);