export type FunctionType = (...args: any[]) => any;

export const wrapFunction = (
    functionToWrap: FunctionType,
    executeBefore?: FunctionType,
    executeAfter?: FunctionType,
) => {
    return function() {
        const args = Array.prototype.slice.call(arguments);
        let result;
        if (!!executeBefore) {
            executeBefore.apply(this, args);
        }

        result = functionToWrap.apply(this, args);

        if (!!executeAfter) {
            executeAfter.apply(this, args);
        }

        return result;
    };

};

export const logger = (func: FunctionType, isProduction: boolean) => {
    const log = (...args: any[]) => {
        if (args.length && args.findIndex((x) => x.type?.includes('chromex')) > -1) {
            return;
        }

        // if origin is ExtensionID than sender is popup window
        const sender = (args[1].origin === `chrome-extension://${chrome.runtime.id}` || args[1].origin === 'null')
            ? 'popup'
            : `tab: ${args[1]?.tab?.title}`;

        const bigLabelStyle = 'font-size: 16px; font-weight: 700; color: #ff0000; margin-bottom: 5px;';
        const senderInfoStyle = 'font-size: 12px; font-weight: 500; color: black;';

        console.group(`%cMessage received! \n%cSender: ${sender}`, bigLabelStyle, senderInfoStyle);
        console.log(args[0]);
        console.groupEnd();
    };

    if (isProduction) {
        return wrapFunction(func);
    }

    return wrapFunction(func, log);
};
