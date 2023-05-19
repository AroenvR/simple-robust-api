import { injectable } from "inversify";
import { IDatabase } from "./IDatabase";
import { IDatabaseConfig } from "./IDatabaseConfig";
import SQLiteDatabase from "./SQLiteDatabase";
import Logger from "../util/Logger";

/**
 * A factory class that creates instances of the appropriate database class based on the configuration type.
 */
@injectable()
export default class DatabaseFactory {

    /**
     * Creates an instance of the appropriate database class based on the configuration type.
     * @param config - The database configuration.
     * @returns An instance of the appropriate database class.
     * @throws If the database type is not supported.
     */
    createDatabase(config: IDatabaseConfig): IDatabase {
        Logger.instance.debug('DatabaseFactory: Creating database of type: ' + config.type);

        switch(config.type) {
            
            case 'sqlite3':
                return new SQLiteDatabase(config);

            default:
                throw new Error('DatabaseFactory: Unknown database type: ' + config.type);
        }
    }
}