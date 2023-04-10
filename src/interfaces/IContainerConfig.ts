import { IAppConfig } from "./IAppConfig";
import { IDatabaseConfig } from "./IDatabaseConfig";

/**
 * IContainerConfig interface represents the configuration object for the container.
 * It contains the app, database, and tasks configuration.
 */
export interface IContainerConfig {
    app: {
        name: string;
        port: number;
    };
    database: {
        filename: string;
        type: string;
    };
    tasks: {
        timeout: number;
    };
}