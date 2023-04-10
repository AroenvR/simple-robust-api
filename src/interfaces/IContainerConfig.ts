import { IAppConfig } from "./IAppConfig";
import { IDatabaseConfig } from "./IDatabaseConfig";

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