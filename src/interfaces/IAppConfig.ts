import { RouteInitEvent } from "../util/RouteInitEvent";
import { IDatabase } from "./IDatabase";

export interface IAppConfig {
    name: string;
    port: number;
    database: IDatabase;
    routeInitEvent: RouteInitEvent;
}