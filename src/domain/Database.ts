import fs from "fs-extra";
import path from 'path';
import sqlite3 from 'sqlite3';
import { Database as SQLiteDatabase } from 'sqlite3';
import { IDatabaseConfig } from '../interfaces/IDatabaseConfig';
import { IDatabase } from '../interfaces/IDatabase';
import { isTruthy } from "../util/isTruthy";
import { constants } from "../util/constants";
import Logger from "../util/Logger";

/**
 * A class that manages a database connection and provides methods to query the database.
 * @implements {IDatabase}
 */
export default class Database implements IDatabase {
    private config: IDatabaseConfig;
    private db: SQLiteDatabase | null = null;

    /**
     * Creates an instance of the Database class.
     * @param config - The configuration object for the database.
     */
    constructor(config: IDatabaseConfig) {
        this.config = config;
    }

    // -----------------------
    // |        SETUP        |
    // -----------------------

    /**
     * Connects to the database.
     * @throws { Error } - If the database type is not supported.
     */
    async connect(): Promise<void> {
        switch (this.config.type) {
            case constants.database.types.SQLITE3:
                return this.sqliteConnect();

            default:
                throw new Error(`Database: Database type ${this.config.type} not supported!`);
        }
    }

    /**
     * Sets up the database by creating tables and enabling foreign keys.
     * @throws { Error } - If the database type is not supported or if an error occurs while creating the schema.
     */
    async setup(): Promise<void> {
        switch (this.config.type) {
            case constants.database.types.SQLITE3:
                return this.sqliteSetup();

            default:
                throw new Error(`Database: Database type ${this.config.type} not supported!`);
        }
    }

    /**
     * Closes the database connection.
     * @throws { Error } - If the database type is not supported.
     */
    async close(): Promise<void> {
        switch (this.config.type) {
            case constants.database.types.SQLITE3:
                return this.sqliteClose();

            default:
                throw new Error(`Database: Database type ${this.config.type} not supported!`);
        }
    }

    // ---------------------
    // |      QUERIES      |
    // ---------------------

    /**
     * Executes an upsert query.
     * @param query - The SQL query to execute.
     * @param params - The query parameters.
     * @returns The ID of the inserted row.
     * @throws {Error} - If the database is not connected or if an error occurs while executing the query.
     */
    async upsert(query: string, params?: any | any[]): Promise<number> {
        if (!this.db) throw new Error('Database: Database not connected!');

        // TODO: Check against SQL injection.
        // TODO: Sanitize params.

        switch (this.config.type) {
            case constants.database.types.SQLITE3:
                return this.sqliteUpsert(query, params);

            default:
                throw new Error(`Database: Database type ${this.config.type} not supported!`);
        }
    }

    /**
     * Executes a select all query.
     * @param {string} query - The SQL query to execute.
     * @returns An array of objects representing the selected rows.
     * @throws { Error } - If the database is not connected or if an error occurs while executing the query.
     */
    async selectMany(query: string, params?: string[] | number[]): Promise<any[]> {
        if (!this.db) throw new Error('Database: Database not connected!');

        // TODO: Check against SQL injection.

        switch (this.config.type) {
            case constants.database.types.SQLITE3:
                return this.sqliteSelectMany(query, params);

            default:
                throw new Error(`Database: Database type ${this.config.type} not supported!`);
        }
    }

    /**
     * Executes the provided query and returns a single row from the result set.
     * @param query - The SQL query string to execute.
     * @param params - Optional parameters to pass to the query.
     * @returns A promise that resolves to a single row from the result set.
     * @throws { Error } - If the database is not connected or if the database type is not supported.
     */
    async selectOne(query: string, params?: string[] | number[]): Promise<number> {
        if (!this.db) throw new Error('Database: Database not connected!');

        switch (this.config.type) {
            case constants.database.types.SQLITE3:
                return this.sqliteGetOne(query, params);

            default:
                throw new Error(`Database: Database type ${this.config.type} not supported!`);
        }
    }

    // ---------------------
    // |      SQLite3      |
    // ---------------------

    /**
     * Connect to a SQLite3 database.
     */
    private sqliteConnect(): Promise<void> {
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
     * Setup a SQLite3 database.
     */
    private sqliteSetup(): Promise<void> {
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
            const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
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
     * Close the connection to a SQLite3 database.
     */
    private sqliteClose(): Promise<void> {
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
     * UPSERT query for SQLite3
     */
    private sqliteUpsert = async (query: string, params: any | any[]): Promise<number> => { // TODO: Intrerface?
        Logger.instance.info("Database: executing SQLite upsert query.");

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
                    resolve(this.lastID);
                }
            });
        });
    }

    /**
     * SELECT many rows for SQLite3
     */
    private sqliteSelectMany = async (query: string, params?: string[] | number[]): Promise<any[]> => {
        Logger.instance.info("Database: executing SQLite get many query.");

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            if (!isTruthy(params)) params = [];
            this.db.all(query, [], (err: Error | null, rows: any[]) => {
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
     * SELECT one row for SQLite3
     */
    private sqliteGetOne = async (query: string, params?: string[] | number[]): Promise<number> => {
        Logger.instance.debug("Database: executing SQLite get one query.");


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