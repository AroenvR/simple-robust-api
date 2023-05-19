/**
 * IContainerConfig interface represents the configuration object for the container.
 * It contains the app, database, and tasks configuration.
 */
export interface IServerConfig {
    app: {
        name: string;
        port: number;
        corsConfig: {
            originAllowList: string[];
        };
    };
    database: {
        filename: string;
        driver: string;
    };
    logging: {
        level: string;
        console: boolean;
        http: boolean;
        file: boolean;
        filePath?: string;
    };
    tasks: {
        timeout: number;
    };
}