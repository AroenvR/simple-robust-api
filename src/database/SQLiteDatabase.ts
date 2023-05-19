import fs from "fs-extra";
import path from 'path';
import { inject } from "inversify";
import { IDatabase } from "./IDatabase";
import { TYPES } from "../ioc/TYPES";
import { IDatabaseConfig } from "./IDatabaseConfig";
import Logger from "../util/logging/Logger";
import { IInsertReturn } from "./IInsertReturn";
import { Knex, knex } from 'knex'


/**
 * A class that represents an SQLite3 database.
 */
export default class SQLiteDatabase implements IDatabase {
    readonly config: IDatabaseConfig;
    private db: Knex | null = null;

    /**
     * Creates an instance of the SQLiteDatabase class.
     * @param config - The database configuration.
     */
    constructor(@inject(TYPES.IDatabaseConfig) config: IDatabaseConfig) {
        this.config = config;
    }

    /**
     * Connects to the SQLite3 database.
     * @returns A promise that resolves when the connection is established.
     * @throws If there is an error connecting to the database.
     */
    async connect(): Promise<void> {
        Logger.instance.debug("Database: Connecting to SQLite database.");

        try {
            this.db = knex({
                client: this.config.driver,
                connection: {
                    filename: this.config.connection
                },
                useNullAsDefault: true
            });

            Logger.instance.debug("Database: SQLite database connected.");
        } catch (err) {
            Logger.instance.critical("Database: Error connecting to database:", err);
            throw err;
        }
    }

    /**
     * Setup an SQLite3 database.
     * @returns A promise that resolves when the database is set up.
     * @throws If there is an error setting up the database.
     */
    async setup(): Promise<void> {
        Logger.instance.debug("Database: Setting up SQLite database.");

        if (!this.db) {
            throw new Error('Database: Database not connected');
        }

        try {
            // Enable foreign keys.
            await this.db.raw('PRAGMA foreign_keys = ON');
            Logger.instance.debug("Database: SQLite database foreign keys successfully enabled.");

            // Read the schema from the file and create the database schema.
            const schemaPath = path.join(__dirname, './', 'sql', 'schema.sql');
            const schema = await fs.readFile(schemaPath, 'utf8');

            await this.db.raw(schema);
            Logger.instance.debug("Database: SQLite database schema successfully created.");

        } catch (err) {
            Logger.instance.critical("Database: Error setting up SQLite database:", err);
            throw err;
        }
    }

    /**
     * Closes the connection to the SQLite3 database.
     * @returns A promise that resolves when the connection is closed.
     * @throws If there is an error closing the connection.
     */
    async close(): Promise<void> {
        Logger.instance.debug("Database: Closing SQLite database connection.");

        if (!this.db) {
            throw new Error('Database: Database not connected!');
        }

        await this.db.destroy()
            .then(() => {
                this.db = null;
                Logger.instance.debug("Database: SQLite database closed.");
            })
            .catch((err) => {
                Logger.instance.error("Database: Error closing SQLite database:", err);
                throw err;
            });
    }

    /**
     * Executes an upsert query.
     */
    public upsert = async (tableName: string, data: any | any[]): Promise<IInsertReturn> => {
        Logger.instance.info("Database: executing SQLite upsert query.");
        Logger.instance.debug(`Database: table: ${tableName} | data:`, data);

        if (!Array.isArray(data)) data = [data];

        try {
            const result = await this.db!(tableName).insert(data);
            const changes = result.length;
            const lastId = result[0];

            Logger.instance.info("Database: upsert query executed successfully.");
            return { changes, lastId };

        } catch (err) {
            Logger.instance.error("Database: Error executing upsert query:", err);
            throw err;
        }
    }

    /**
     * Executes a select all query.
     */
    public selectMany = async (tableName: string, whereClause?: object): Promise<any[]> => {
        Logger.instance.info("Database: executing SQLite get many query.");
        Logger.instance.debug(`Database: table: ${tableName} | whereClause: ${whereClause}`);

        const queryBuilder = this.db!.select().from(tableName);

        if (whereClause) {
            queryBuilder.where(whereClause);
        }

        try {
            const rows = await queryBuilder;

            Logger.instance.info("Database: get many query executed successfully.");
            return rows;

        } catch (err) {
            Logger.instance.error("Database: Error executing get many query:", err);
            throw err;
        }
    }

    /**
     * Executes a SQLite SELECT query that selects rows from a table based on a range of IDs.
     */
    public selectFromIdToId = async (tableName: string, fromId: number, toId: number): Promise<any[]> => {
        Logger.instance.info("Database: executing SQLite select from id to id query.");
        Logger.instance.debug(`Database: table: ${tableName} | fromId: ${fromId} | toId: ${toId}`);

        try {
            const rows = await this.db!.select().from(tableName).whereBetween('id', [fromId, toId]);

            Logger.instance.info("Database: get many query executed successfully.");
            return rows;

        } catch (err) {
            Logger.instance.error("Database: Error executing get many query:", err);
            throw err;
        }
    }

    /**
     * Executes the provided query and returns a single row from the result set.
     */
    public selectOne = async (tableName: string, whereClause?: object, orderBy?: [string, 'asc' | 'desc']): Promise<any> => {
        Logger.instance.debug("Database: executing SQLite get one query.");

        const queryBuilder = this.db!.select().from(tableName).limit(1);

        if (whereClause) {
            queryBuilder.where(whereClause);
        }

        if (orderBy) {
            queryBuilder.orderBy(...orderBy);
        }

        try {
            const row = await queryBuilder;

            return row[0];

        } catch (err) {
            Logger.instance.error("Database: Error executing get one query:", err);
            throw err;
        }
    }
}