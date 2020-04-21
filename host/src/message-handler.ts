import {
    NativeMessage,
    Push,
    Done,
    NativeMessageTypeEnum,
    ExecuteCommandNativeMessage
} from 'common';
const { spawn } = require('child_process');

function messageHandler(msg: NativeMessage, push: Push, done: Done) {
    switch (msg.type) {
        case NativeMessageTypeEnum.Echo: {
            push(msg);
            done();
            break;
        }
        case NativeMessageTypeEnum.ExecuteCommand: {
            const message: ExecuteCommandNativeMessage = msg;
            const args = message.command.split(' ');
            const command = args.shift();
            const sp = spawn(command, args);

            break;
        }
        default: {
            const exhaustingCheck: never = msg.type;
        }
    }
}

module.exports = messageHandler;
