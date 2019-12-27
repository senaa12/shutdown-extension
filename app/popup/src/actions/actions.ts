import { Action, ActionTypeEnum, ApplicationModeEnum } from 'common';

export const changeAppState = (newState: ApplicationModeEnum) => {
    return {
        type: ActionTypeEnum.ChangeApplicationState,
        data: newState,
    };
};
