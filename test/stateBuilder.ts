// import { RecursivePartial, RootReducerState, TabStateEnum } from 'src/common';
// import createStore from 'store-config';

// // tslint:disable-next-line: no-var-requires
// const merge = require('deepmerge');

// export default class StateBuilder {
//     private state: RootReducerState;

//     // tslint:disable-next-line: no-empty
//     constructor() {}

//     public tabIdWithVideo = 12;

//     public create(initialStore: RecursivePartial<RootReducerState> = {}) {
//         const store = new StateBuilder();
//         store.state = {} as RootReducerState; // createStore(initialStore).getState();

//         return store;
//     }

//     public setHostActivity(isActive: boolean) {
//         this.state = {
//             ...this.state,
//             appReducer: {
//                 ...this.state.appReducer,
//                 isHostAppActive: isActive,
//             },
//         };
//         return this;
//     }

//     public withVideoPlayer() {
//         this.state = {
//             ...this.state,
//             activeTabReducer: {
//                 ...this.state.activeTabReducer,
//                 tabID: this.tabIdWithVideo,
//                 state: TabStateEnum.PageContainsVideoTag,
//                 videoDuration: 26,
//             },
//         };
//         return this;
//     }

//     public setInputSelectedTime() {
//         this.state = {
//             ...this.state,
//             appReducer: {
//                 ...this.state.appReducer,
//                 inputSelectedTime: '00:10:00',
//             },
//         };
//         return this;
//     }

//     public setInputDateTime() {
//         this.state = {
//             ...this.state,
//             appReducer: {
//                 ...this.state.appReducer,
//                 inputSelectedDateTimeString: new Date().toString(),
//             },
//         };
//         return this;
//     }

//     public withVideoPlayerEventScheduled() {
//         this.state = {
//             ...this.state,
//             appReducer: {
//                 ...this.state.appReducer,
//                 shutdownEventScheduleData: this.tabIdWithVideo,
//                 inputSelectedTime: '00:05:00',
//             },
//         };
//         return this;
//     }

//     public getState() {
//         return this.state;
//     }

//     public setState(state: RecursivePartial<RootReducerState>) {
//         this.state = merge(this.state, state);
//         return this;
//     }
// }
