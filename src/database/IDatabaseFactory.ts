import { IDatabase } from "./IDatabase";
import { IDatabaseConfig } from "./IDatabaseConfig";

export interface IDatabaseFactory {
    createDatabase(config: IDatabaseConfig): IDatabase;
}