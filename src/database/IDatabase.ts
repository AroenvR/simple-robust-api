import { IDatabaseConfig } from "./IDatabaseConfig";

/**
 * IDatabase interface represents the contract for a database class.
 * It defines the methods required for connecting, querying, closing, and setting up the database.
 */
export interface IDatabase {
    readonly config: IDatabaseConfig;

    /**
     * Connects to the database.
     * @returns A promise that resolves when the connection is established, or rejects with an error if the connection fails.
     */
    connect(): Promise<void>;

    /**
     * Sets up the database by enabling foreign keys and creating the schema.
     * @returns A promise that resolves when the setup is complete, or rejects with an error if the setup fails.
     */
    setup(): Promise<void>;

    /**
     * Closes the database connection.
     * @returns A promise that resolves when the connection is closed, or rejects with an error if closing the connection fails.
     */
    close(): Promise<void>;

    /**
     * Retrieves the instance of the database client connected database.
     * @returns The database instance if the connection.
     */
    getInstance(): any;
}
