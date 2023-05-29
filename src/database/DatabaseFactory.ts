import { injectable } from "inversify";
import { IDatabase } from "./IDatabase";
import { IDatabaseConfig } from "./IDatabaseConfig";
import Database from "./Database";
import Logger from "../util/logging/Logger";
import { constants } from "../util/constants";

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
        Logger.instance.debug('DatabaseFactory: Creating database of type: ' + config.driver);

        switch (config.driver) {

            case constants.database.types.SQLITE3:
                return new Database(config);

            /*
                In theory, the following database connections should be supported:
                - SQLite3
                - MySQL
                - PostgreSQL
                - CockroachDB
                - MariaDB
                - Better-SQLite3
                - Oracle
                - Amazon Redshift
                - MSSQL (Microsoft SQL Server)
            */

            default:
                throw new Error('DatabaseFactory: Unknown database type: ' + config.driver);
        }
    }
}