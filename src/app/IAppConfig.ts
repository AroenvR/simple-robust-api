import { ICorsConfig } from "../util/middleware/ICorsConfig";

/**
 * IAppConfig interface represents the configuration object for the App class.
 * It includes the app name, port, database instance, and route initialization event.
 */
export interface IAppConfig {
    name: string;
    port: number;
    corsConfig: ICorsConfig;
}