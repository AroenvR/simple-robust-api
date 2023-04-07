import fs from "fs-extra";
import path from 'path';
import sqlite3 from 'sqlite3';
import { Database as SQLiteDatabase } from 'sqlite3';
import { logger, LogLevel } from '../util/logger';
import { IDatabaseConfig } from '../interfaces/IDatabaseConfig';
import { IDatabase } from '../interfaces/IDatabase';
import { isTruthy } from "../util/isTruthy";

export class Database implements IDatabase {
    private config: IDatabaseConfig;
    private db: SQLiteDatabase | null = null;

    constructor(config: IDatabaseConfig) {
        this.config = config;
    }

    async connect(): Promise<void> {
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

    async selectAll(queryName: string, params?: any[]): Promise<any[]> {
        const queryPath = path.join(__dirname, '..', 'sql', 'sql_queries', `${queryName}.sql`);
        const query = await fs.readFile(queryPath, 'utf8');

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            // TODO: Check against SQL injection.
            // TODO: Sanitize params.

            if (isTruthy(params)) {
                if (!Array.isArray(params)) params = [params];
            }
            else {
                params = [];
            }
            this.db.all(query, params, (err: Error | null, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async upsert(queryName: string, params?: any[]): Promise<void> {
        const queryPath = path.join(__dirname, '..', 'sql', 'sql_queries', `${queryName}.sql`);
        const query = await fs.readFile(queryPath, 'utf8');

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database: Database not connected!'));
                return;
            }

            // TODO: Check against SQL injection.
            // TODO: Sanitize params.

            if (isTruthy(params)) {
                if (!Array.isArray(params)) params = [params];
            }
            else {
                params = [];
            }

            this.db.run(query, params, (err: Error | null) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async close(): Promise<void> {
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
                    resolve();
                }
            });
        });
    }

    async setup(): Promise<void> {
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
}