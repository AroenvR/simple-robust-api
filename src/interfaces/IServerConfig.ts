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
        type: string;
    };
    tasks: {
        timeout: number;
    };
}