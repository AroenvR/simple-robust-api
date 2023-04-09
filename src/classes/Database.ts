import fs from "fs-extra";
import path from 'path';
import sqlite3 from 'sqlite3';
import { Database as SQLiteDatabase } from 'sqlite3';
import { logger, LogLevel } from '../util/logger';
import { IDatabaseConfig } from '../interfaces/IDatabaseConfig';
import { IDatabase } from '../interfaces/IDatabase';
import { isTruthy } from "../util/isTruthy";
import { constants } from "../util/constants";
import queries from "../sql/queries";

/**
 * TODO: Document this class.
 */
export class Database implements IDatabase {
    private config: IDatabaseConfig;
    private db: SQLiteDatabase | null = null;

    constructor(config: IDatabaseConfig) {
        this.config = config;
    }

    // -----------------------
    // |        SETUP        |
    // -----------------------

    /**
     * Connect to the database.
     * @returns 
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
     * Setup the database.
     * @returns 
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
     * Close the database connection.
     * @returns 
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
     * TODO: Document
     * @param query 
     * @returns 
     */
    async selectAll(query: string): Promise<any[]> {
        if (!this.db) throw new Error('Database: Database not connected!');

        // TODO: Check against SQL injection.

        switch (this.config.type) {
            case constants.database.types.SQLITE3:
                return this.sqliteSelectAll(query);

            default:
                throw new Error(`Database: Database type ${this.config.type} not supported!`);
        }
    }

    /**
     * TOOD: Document
     * @param params 
     * @returns 
     */
    async upsert(query: string, params?: any[]): Promise<number> {
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

    // ---------------------
    // |      SQLite3      |
    // ---------------------

    /**
     * Connector for SQLite3
     */
    private sqliteConnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.config.filename, (err: Error | null) => {
                if (err) {
                    logger("Database: Error connecting to database:", LogLevel.CRITICAL, err);
                    reject(err);
                } else {
                    logger("Database: SQLite database connected.", LogLevel.DEBUG);
                    resolve();
                }
            });
        });
    }

    /**
     * Setup for SQLite3
     */
    private sqliteSetup(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected'));
                return;
            }

            // Enable foreign keys.
            this.db.exec('PRAGMA foreign_keys = ON', (err: Error | null) => {
                if (err) {
                    logger("Database: Error executing PRAGMA foreign_keys:", LogLevel.CRITICAL, err);
                    reject(new Error('Database: Error executing PRAGMA foreign_keys: ' + err.message));
                } else {
                    logger("Database: SQLite database foreign keys successfully enabled.", LogLevel.DEBUG);
                }
            });

            // Read the schema from the file and create the database schema.
            const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
            const schema = await fs.readFile(schemaPath, 'utf8');

            this.db.exec(schema, (err: Error | null) => {
                if (err) {
                    logger("Database: Error creating Database schema:", LogLevel.CRITICAL, err);
                    reject(new Error('Database: Error creating Database schema: ' + err.message));
                } else {
                    logger("Database: SQLite database schema successfully created.", LogLevel.DEBUG);
                    resolve();
                }
            });
        });
    }

    /**
     * Closer for SQLite3
     */
    private sqliteClose(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            this.db.close((err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    logger("Database: SQLite database closed.", LogLevel.DEBUG);
                    this.db = null;

                    resolve();
                }
            });
        });
    }

    /**
     * UPSERT query for SQLite3
     */
    private sqliteUpsert = async (query: string, params: any): Promise<number> => { // TODO: Intrerface?
        logger("Database: User executing SQLite3 upsert query.", LogLevel.DEBUG);

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
                    resolve(this.lastID);
                }
            });
        });
    }

    /**
     * SELECT all query for SQLite3
     */
    private sqliteSelectAll = async (query: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            this.db.all(query, [], (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}