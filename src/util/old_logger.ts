import fs from 'fs-extra';
import path from 'path';
import { httpsPost } from './http';

export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    LOG = "LOG",
    WARN = "WARNING",
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
    return;

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

        case LogLevel.LOG:
            console.log(logMessage, object ?? "");
            break;

        case LogLevel.WARN:
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




export class Logger {
    private static _instance: Logger;

    private constructor() { }

    public static get instance(): Logger {
        if (!this._instance) {
            this._instance = new Logger();
        }
        return this._instance;
    }

    private async write(level: LogLevel, message: string, logObj?: any): Promise<void> {
        let extraStr = "";
        let extraObj = logObj;
        if (logObj instanceof Error) {
            extraStr = `\n  Error Name: ${logObj.name}\n  Error Message: ${logObj.message}\n  Stack Trace:\n${logObj.stack?.split('\n').map(line => '  ' + line).join('\n')}`;
            extraObj = {
                name: logObj.name,
                message: logObj.message,
                stack: logObj.stack,
            };
        } else {
            extraStr = JSON.stringify(logObj) ?? "";
        }

        const logMessage = `${level}: ${message} ${JSON.stringify(extraStr) ?? ""}`;
        console.log(logMessage);

        const logObject = {
            level,
            message: logMessage,
            extra: extraObj,
            timestamp: new Date().toISOString(),
        };
        // httpsPost("todo.com", logObject).catch((err) => console.error("CRITICAL - Logger: Failed to post log!", err));

        const logFilePath = path.join(__dirname, '../logs', 'OLD_LOG.json'); // Change the path to the desired log file location
        try {
            await fs.ensureFile(logFilePath);
            const logString = JSON.stringify(logObject, null, 4) + ',\n';
            await fs.appendFile(logFilePath, logString);
        } catch (err) {
            console.error("CRITICAL - Logger: Failed to write to file!", err);
        }
    }

    public async debug(message: string, extra?: any): Promise<void> {
        this.write(LogLevel.DEBUG, message, extra);
    }

    public async info(message: string, extra?: any): Promise<void> {
        this.write(LogLevel.INFO, message, extra);
    }

    public async log(message: string, extra?: any): Promise<void> {
        this.write(LogLevel.LOG, message, extra);
    }

    public async warn(message: string, extra?: any): Promise<void> {
        this.write(LogLevel.WARN, message, extra);
    }

    public async error(message: string, extra?: any): Promise<void> {
        this.write(LogLevel.ERROR, message, extra);
    }

    public async critical(message: string, extra?: any): Promise<void> {
        this.write(LogLevel.CRITICAL, message, extra);
    }
}
