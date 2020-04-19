import {
    NativeMessage,
    Push,
    Done,
    NativeMessageTypeEnum
} from 'common';
const { spawn } = require('child_process');

function messageHandler(msg: NativeMessage, push: Push, done: Done) {
    switch (msg.type) {
        case NativeMessageTypeEnum.Echo: {
            push(msg);
            done();
        }
        case NativeMessageTypeEnum.ExecuteCommand:
        default: {
            const exhaustingCheck: never = msg.type;
        }
    }
}

module.exports = messageHandler;