import { injectable } from "inversify";
import Database from "./Database";
import { IDatabase } from "./IDatabase";
import { IDatabaseConfig } from "./IDatabaseConfig";
import { IDatabaseFactory } from "./IDatabaseFactory";

// @ts-ignore
@injectable()
export default class DatabaseFactory implements IDatabaseFactory {
    createDatabase(config: IDatabaseConfig): IDatabase {
        return new Database(config);
    }
}