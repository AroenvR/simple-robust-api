import fs from "fs-extra";
import path from 'path';
import { inject } from "inversify";
import sqlite3 from 'sqlite3';
import { IDatabase } from "./IDatabase";
import { TYPES } from "../ioc/TYPES";
import { IDatabaseConfig } from "./IDatabaseConfig";
import Logger from "../util/logging/Logger";
import { isTruthy } from "../util/isTruthy";
import { IInsertReturn } from "./IInsertReturn";

/**
 * A class that represents an SQLite3 database.
 */
export default class SQLiteDatabase implements IDatabase {
    private config: IDatabaseConfig;
    private db: sqlite3.Database | null = null;

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

        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.config.filename, (err: Error | null) => {
                if (err) {
                    Logger.instance.error("Database: Error connecting to database:", err);
                    reject(err);
                } else {
                    Logger.instance.debug("Database: SQLite database connected.");
                    resolve();
                }
            });
        });
    }

    /**
     * Setup an SQLite3 database.
     * @returns A promise that resolves when the database is set up.
     * @throws If there is an error setting up the database.
     */
    async setup(): Promise<void> {
        Logger.instance.debug("Database: Setting up SQLite database.");

        return new Promise(async (resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected'));
                return;
            }

            // Enable foreign keys.
            this.db.exec('PRAGMA foreign_keys = ON', (err: Error | null) => {
                if (err) {
                    Logger.instance.critical("Database: Error executing PRAGMA foreign_keys:", err);
                    reject(new Error('Database: Error executing PRAGMA foreign_keys: ' + err.message));
                } else {
                    Logger.instance.debug("Database: SQLite database foreign keys successfully enabled.");
                }
            });

            // Read the schema from the file and create the database schema.
            const schemaPath = path.join(__dirname, './', 'sql', 'schema.sql');
            const schema = await fs.readFile(schemaPath, 'utf8');

            this.db.exec(schema, (err: Error | null) => {
                if (err) {
                    Logger.instance.critical("Database: Error creating Database schema:", err);
                    reject(new Error('Database: Error creating Database schema: ' + err.message));
                } else {
                    Logger.instance.debug("Database: SQLite database schema successfully created.");
                    resolve();
                }
            });
        });
    }

    /**
     * Closes the connection to the SQLite3 database.
     * @returns A promise that resolves when the connection is closed.
     * @throws If there is an error closing the connection.
     */
    async close(): Promise<void> {
        Logger.instance.debug("Database: Closing SQLite database connection.");

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            this.db.close((err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    Logger.instance.debug("Database: SQLite database closed.");
                    this.db = null;

                    resolve();
                }
            });
        });
    }

    /**
     * Executes an upsert query.
     * @param query - The SQL query to execute.
     * @param params - The query parameters.
     * @returns The ID of the inserted row.
     * @throws If the database is not connected or if an error occurs while executing the query.
     */
    public upsert = async (query: string, params: any | any[]): Promise<IInsertReturn> => { // TODO: Intrerface?
        Logger.instance.info("Database: executing SQLite upsert query.");
        Logger.instance.debug(`Database: query: ${query} | params: ${params}`);

        return new Promise((resolve, reject) => {
            const mappedParams: any[] = [];
            if (isTruthy(params)) {
                if (!Array.isArray(params)) params = [params];

                for (const obj of params) {
                    for (const [key, value] of Object.entries(obj)) {
                        if (key === '_id') continue;
                        mappedParams.push(value);
                    }
                }
            }

            this.db!.run(query, mappedParams, function (err: Error | null) {
                if (err) {
                    reject(err);
                } else {
                    Logger.instance.info("Database: upsert query executed successfully.");
                    resolve({ changes: this.changes, lastId: this.lastID });
                }
            });
        });
    }

    /**
     * Executes a select all query.
     * @param query - The SQL query to execute.
     * @returns An array of objects representing the selected rows.
     * @throws If the database is not connected or if an error occurs while executing the query.
     */
    public selectMany = async (query: string, params?: string[] | number[]): Promise<any[]> => {
        Logger.instance.info("Database: executing SQLite get many query.");
        Logger.instance.debug(`Database: query: ${query} | params: ${params}`);

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            if (!isTruthy(params)) params = [];
            this.db.all(query, [], function (err: Error | null, rows: any[]) {
                if (err) {
                    reject(err);
                } else {
                    Logger.instance.info("Database: get many query executed successfully.");
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Executes a SQLite SELECT query that selects rows from a table based on a range of IDs.
     * @param query - The SELECT query to execute.
     * @param params - An array of parameters to pass to the query.
     * @returns A promise that resolves with an array of rows returned by the query.
     * @throws If the database is not connected or if there is an error executing the query.
     */
    public selectFromIdToId = async (query: string, params?: string[] | number[]): Promise<any[]> => {
        Logger.instance.info("Database: executing SQLite select from id to id query.");
        Logger.instance.debug(`Database: query: ${query} | params: ${params}`);

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            if (!isTruthy(params)) params = [];
            this.db.all(query, params, function (err: Error | null, rows: any[]) {
                if (err) {
                    reject(err);
                } else {
                    Logger.instance.info("Database: get many query executed successfully.");
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Executes the provided query and returns a single row from the result set.
     * @param query - The SQL query string to execute.
     * @param params - Optional parameters to pass to the query.
     * @returns A promise that resolves to a single row from the result set.
     * @throws If the database is not connected or if the database type is not supported.
     */
    public selectOne = async (query: string, params?: string[] | number[]): Promise<number> => {
        Logger.instance.debug("Database: executing SQLite get one query.");
        Logger.instance.debug(`Database: query: ${query} | params: ${params}`);

        return new Promise((resolve, reject) => {
            if (!isTruthy(params)) params = [];
            this.db!.get(query, params, (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}