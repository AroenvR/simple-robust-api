export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL",
}

/**
 * Logs a message to the console.
 * The message contains the file name, function name, and messages + optional objects.
 * The file name and function name are captured automatically.
 * @param message The message to be logged.
 * @param object An optional object, string or null that provides additional information.
 * @param logLevel The log level to use when logging the message.
 * @example
 * logger("A message", null, LogLevel.DEBUG);
 * logger("A message", { foo: "bar" }, LogLevel.INFO);
 */
export const logger = async (message: string, logLevel: LogLevel, object?: object | string | Error | null | any): Promise<void> => {

    // let functionName = "-";
    // const customError: { stack?: string } = {};
    // Error.captureStackTrace(customError);
    // const stack = customError.stack || "";
    // const lines = stack.split("\n");
    // const callerLine = lines[3];
    // console.log("stack:", stack);

    // if (callerLine) {
    //     console.log('callerLine:', callerLine); // Debug log

    //     const matchFunction = callerLine.match(/at\s(?:new\s)?(?:[^(]*?\()?(?:\S+\.)*(\S+)\s\(?/);
    //     if (matchFunction && matchFunction.length > 1) {
    //         functionName = matchFunction[1];
    //         if (functionName === '<anonymous>') {
    //             functionName = '-';
    //         }
    //     }
    //     console.log('functionName:', functionName); // Debug log
    // }


    // let functionName = "-";
    // const customError: { stack?: string } = {};
    // Error.captureStackTrace(customError);
    // const stack = customError.stack || "";
    // const lines = stack.split("\n");
    // const callerLine = lines[3];

    // if (callerLine) {
    //     const matchFunction = callerLine.match(/at\s(?:new\s)?(?:[^]*?\s)?(\S+)\s\(?/);
    //     if (matchFunction && matchFunction.length > 1) {
    //         functionName = matchFunction[1];
    //         if (functionName === '<anonymous>') {
    //             functionName = '-';
    //         }
    //     }

    //     // const matchFile = callerLine.match(/(\S+):\d+:\d+/);
    //     // if (matchFile && matchFile.length > 1) {
    //     //     fileName = matchFile[1].split(/[\\/]/).pop() || "-";
    //     // }
    // }

    // let functionName = "-";
    // try {
    //     throw new Error();
    // } catch (error: any) {
    //     const stack = error.stack || "";
    //     const match = stack.match(/at (.*)\s+\(/);
    //     if (match && match.length > 1) {
    //         functionName = match[1];
    //     }
    // }

    // TODO: File: ${fileName} | Function: ${functionName} | 
    const logMessage = `${message}`;

    // if (!appConfig.logging) return;

    switch (logLevel) {
        case LogLevel.DEBUG:
            console.debug(logMessage, object ?? "");
            break;

        case LogLevel.INFO:
            console.info(logMessage, object ?? "");
            break;

        case LogLevel.WARNING:
            console.warn(logMessage, object ?? "");
            break;

        case LogLevel.ERROR:
            console.error("ERROR - " + logMessage, object ?? "");
            break;

        case LogLevel.CRITICAL:
            console.error(`CRITICAL - ${logMessage}`, object ?? "");
            break;

        default:
            console.log(logMessage, object ?? "");
            break;
    }
};

/*
    Usage:
    const log = logger("fileName.ts");
    log("Hello World!", null, LogLevel.INFO);
*/
