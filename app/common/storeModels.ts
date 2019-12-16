export interface ShutdownSubscriptionReducerState {
    isEventSubscibed: boolean;
    tabId: number;
}

export interface RootReducerState {
    shutdownSubscriptionReducer: ShutdownSubscriptionReducerState;
}
