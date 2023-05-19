import fs from "fs-extra";
import path from 'path';
import { inject } from "inversify";
import sqlite3 from 'sqlite3';
import { IDatabase } from "./IDatabase";
import { TYPES } from "../ioc_container/IocTypes";
import { IDatabaseConfig } from "./IDatabaseConfig";
import Logger from "../util/Logger";
import { isTruthy } from "../util/isTruthy";
import { IInsertReturn } from "../interfaces/IInsertReturn";

/**
 * A class that represents a SQLite3 database.
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
     * UPSERT query for SQLite3
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
     * SELECT many rows for SQLite3
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
     * 
     * @param query 
     * @param params 
     * @returns 
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
     * SELECT one row for SQLite3
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