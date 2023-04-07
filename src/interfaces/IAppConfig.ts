import { IDatabase } from "./IDatabase";

export interface IAppConfig {
    name: string;
    database: IDatabase;
}