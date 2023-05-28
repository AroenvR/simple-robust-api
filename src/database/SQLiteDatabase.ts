import fs from "fs-extra";
import path from 'path';
import { inject } from "inversify";
import { IDatabase } from "./IDatabase";
import { TYPES } from "../ioc/TYPES";
import { IDatabaseConfig } from "./IDatabaseConfig";
import Logger from "../util/logging/Logger";
import { IInsertReturn } from "./IInsertReturn";
import { Knex, knex } from 'knex'
import { knexSchemaBuilder } from "./sql/knexSchemaBuilder";
import { IDTO } from "../api/dto/IDTO";


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
        Logger.instance.debug("SQLiteDatabase: Connecting to SQLite database.");

        try {
            this.db = knex({
                client: this.config.driver,
                connection: {
                    filename: this.config.connection
                },
                useNullAsDefault: true
            });

            Logger.instance.debug("SQLiteDatabase: SQLite database connected.");
        } catch (err) {
            Logger.instance.critical("SQLiteDatabase: Error connecting to database:", err);
            throw err;
        }
    }

    /**
     * Setup an SQLite3 database.
     * @returns A promise that resolves when the database is set up.
     * @throws If there is an error setting up the database.
     */
    async setup(): Promise<void> {
        Logger.instance.debug("SQLiteDatabase: Setting up SQLite database.");

        if (!this.db) {
            throw new Error('SQLiteDatabase: Database not connected');
        }

        try {
            // Enable foreign keys.
            await this.db.raw('PRAGMA foreign_keys = ON');
            Logger.instance.debug("SQLiteDatabase: SQLite database foreign keys successfully enabled.");

            await knexSchemaBuilder(this.db);
            Logger.instance.debug("SQLiteDatabase: SQLite database schema successfully created.");
        } catch (err) {
            Logger.instance.critical("SQLiteDatabase: Error setting up SQLite database:", err);
            throw err;
        }
    }

    /**
     * Closes the connection to the SQLite3 database.
     * @returns A promise that resolves when the connection is closed.
     * @throws If there is an error closing the connection.
     */
    async close(): Promise<void> {
        Logger.instance.debug("SQLiteDatabase: Closing SQLite database connection.");

        if (!this.db) {
            throw new Error('SQLiteDatabase: Database not connected!');
        }

        await this.db.destroy()
            .then(() => {
                this.db = null;
                Logger.instance.debug("SQLiteDatabase: SQLite database closed.");
            })
            .catch((err) => {
                Logger.instance.error("SQLiteDatabase: Error closing SQLite database:", err);
                throw err;
            });
    }

    /**
     * Retrieves the instance of the Knex client connected to the SQLite database.
     * @returns The Knex instance if the connection is established, null otherwise.
     */
    getInstance(): Knex {
        if (!this.db) {
            throw new Error('SQLiteDatabase getInstance: Database not connected!');
        }

        return this.db;
    }
}