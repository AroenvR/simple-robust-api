// util/logger.ts
import path from 'path';
import winston from 'winston';
import { ILoggerConfig } from '../interfaces/ILoggerConfig';

/**
 * SECURITY  
 * Logger class to handle application logs.  
 * It provides various log levels and supports different transports (console, HTTP, and file).
 */
export default class Logger {
    private static _instance: Logger;
    private _logger: winston.Logger;

    /**
     * Constructs a Logger instance with the given configuration.
     * @param config ILoggerConfig object containing the logger configuration.
     */
    constructor(config: ILoggerConfig) {
        this._logger = this.configureLogger(config);
    }

    /**
    * Gets the Logger instance.
    * @throws Error if the instance is not created yet.
    */
    public static get instance(): Logger {
        if (!this._instance) {
            throw new Error("Logger instance not created. Call Logger.create(config) first.");
        }
        return this._instance;
    }

    /**
     * Creates a Logger instance with the given configuration.
     * @param config ILoggerConfig object containing the logger configuration.
     * @returns The created Logger instance.
     */
    public static create(config: ILoggerConfig): Logger {
        if (!this._instance) {
            this._instance = new Logger(config);
        }
        return this._instance;
    }

    /**
     * Configures the logger with the given configuration.
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A configured winston.Logger instance.
     */
    private configureLogger(config: ILoggerConfig): winston.Logger {
        const customLevels = {
            critical: 0,
            error: 1,
            warn: 2,
            verbose: 3,
            info: 4,
            debug: 5,
        };

        const transports: winston.transport[] = [
            new winston.transports.Console(this.configureConsoleTransport(config)),
        ];

        if (config.file) {
            transports.push(new winston.transports.File(this.configureFileTransport(config)));
        }

        if (config.http) {
            transports.push(new winston.transports.Http(this.configureHttpTransport(config)));
        }

        return winston.createLogger({
            levels: customLevels,
            transports: transports,
        });
    }

    /**
     * Configures the console transport based on the ILoggerConfig.
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A winston.transports.ConsoleTransportOptions instance.
     */
    private configureConsoleTransport(config: ILoggerConfig): winston.transports.ConsoleTransportOptions {
        return {
            level: config.level,
            format: winston.format.printf(({ level, message, metadata }) => {
                let extraStr = "";
                if (metadata instanceof Error) {
                    extraStr = `\n  Error Name: ${metadata.name}\n  Error Message: ${metadata.message}\n  Stack Trace:\n${metadata.stack?.split('\n').map(line => '  ' + line).join('\n')}`;
                } else {
                    extraStr = metadata ? "\n" + JSON.stringify(metadata, null, 4) : "";
                }

                if (level === 'verbose') level = "log";
                return `${level.toUpperCase()} - ${message} ${extraStr}`;
            }),
            silent: config.console ? false : true,
        };
    }

    /**
     * Configures the file transport based on the ILoggerConfig.
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A winston.transports.FileTransportOptions instance.
     */
    private configureFileTransport(config: ILoggerConfig): winston.transports.FileTransportOptions {
        return {
            level: config.level,
            filename: config.filePath ?? path.join(__dirname, '../logs', `${new Date().toISOString().replace(/[:.]/g, '-')}.log`),
            format: winston.format.printf(({ level, message, metadata }) => {
                const now = new Date();
                const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

                let extraStr = "";
                if (metadata instanceof Error) {
                    extraStr = `\n  Error Name: ${metadata.name}\n  Error Message: ${metadata.message}\n  Stack Trace:\n${metadata.stack?.split('\n').map(line => '  ' + line).join('\n')}`;
                } else {
                    extraStr = metadata ? "\n" + JSON.stringify(metadata, null, 4) : "";
                }

                if (level === 'verbose') level = "log";
                return `${timestamp} ${level.toUpperCase()} - ${message} ${extraStr}`;
            }),
            silent: config.file ? false : true,
        };
    }

    /**
     * Configures the HTTP transport based on the ILoggerConfig.  
     * **Does not log any debug logging level.**
     * @param config - ILoggerConfig object containing the logger configuration.
     * @returns A winston.transports.HttpTransportOptions instance.
     */
    private configureHttpTransport(config: ILoggerConfig): winston.transports.HttpTransportOptions {
        return {
            level: config.level === "debug" ? "info" : config.level,
            host: 'todo.com',
            path: '/todo',
            ssl: true,
            auth: {
                bearer: process.env.BEARER_TOKEN
            },
            format: winston.format.printf(({ level, message, metadata }) => {
                if (level === 'verbose') level = "log";

                const payload = {
                    level: level.toUpperCase(),
                    message: message,
                    metadata: metadata instanceof Error ? {
                        errorName: metadata.name,
                        errorMessage: metadata.message,
                        stackTrace: metadata.stack
                    } : metadata,
                };

                return JSON.stringify(payload);
            }),
            silent: config.http ? false : true,
        }
    }

    /**
     * Writes a log entry with the given level, message, and extra data.
     * @param level The log level (e.g., 'info', 'debug', 'error', etc.).
     * @param message The log message.
     * @param extra Optional extra data to include in the log entry.
     */
    private async create(level: string, message: string, extra?: any): Promise<void> {
        this._logger.log(level, message, { metadata: extra });
    }

    /* 
        Public logging methods for different log levels (debug, info, log, warn, error, critical) 
    */

    public async debug(message: string, extra?: any): Promise<void> {
        this.create('debug', message, extra);
    }

    public async info(message: string, extra?: any): Promise<void> {
        this.create('info', message, extra);
    }

    public async log(message: string, extra?: any): Promise<void> {
        this.create('verbose', message, extra);
    }

    public async warn(message: string, extra?: any): Promise<void> {
        this.create('warn', message, extra);
    }

    public async error(message: string, extra?: any): Promise<void> {
        this.create('error', message, extra);
    }

    public async critical(message: string, extra?: any): Promise<void> {
        this.create('critical', message, extra);
    }
}