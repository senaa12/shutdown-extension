import { ActionResultActionTypeEnum, ActionResultEnum, AppActionTypeEnum, TabsActionTypeEnum, TabState } from 'common';
import store from '.';

export const triggerTooltipWithMessage = (respMessage: string, action: ActionResultEnum) => {
    store.dispatch({
        type: ActionResultActionTypeEnum.TriggerTooltip,
        data: {
            type: action,
            message: respMessage,
        },
    });
};

export const sendResultingTabState = (actionData: TabState) => {
    store.dispatch({
        type: TabsActionTypeEnum.SetTabState,
        data: actionData,
    });
};

export const scheduleShutdownAction = (actionData: any) => {
    store.dispatch({
        type: AppActionTypeEnum.ScheduleShutdown,
        data: actionData,
    });
};

export const changeInputSelectedTime = (newVal: string | undefined) => {
    store.dispatch({
        type: AppActionTypeEnum.ChangeSelectedTime,
        data: newVal,
    });
};
