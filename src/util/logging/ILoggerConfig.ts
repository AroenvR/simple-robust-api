export interface ILoggerConfig {
    level: string;
    console: boolean;
    http: boolean;
    file: boolean;
    filePath?: string;
}