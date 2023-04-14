import { RouteInitEvent } from "../util/RouteInitEvent";
import { ICorsConfig } from "./ICorsConfig";
import { IDatabase } from "./IDatabase";

/**
 * IAppConfig interface represents the configuration object for the App class.
 * It includes the app name, port, database instance, and route initialization event.
 */
export interface IAppConfig {
    name: string;
    port: number;
    database: IDatabase;
    routeInitEvent: RouteInitEvent;
    corsConfig: ICorsConfig;
}