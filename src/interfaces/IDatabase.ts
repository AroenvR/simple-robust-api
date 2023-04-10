import { IDatabaseConfig } from "./IDatabaseConfig";

/**
 * IDatabase interface represents the contract for a database class.
 * It defines the methods required for connecting, querying, closing, and setting up the database.
 */
export interface IDatabase {
    /**
     * Connects to the database.
     * @returns {Promise<void>} A promise that resolves when the connection is established, or rejects with an error if the connection fails.
     */
    connect(): Promise<void>;

    /**
     * Sets up the database by enabling foreign keys and creating the schema.
     * @returns {Promise<void>} A promise that resolves when the setup is complete, or rejects with an error if the setup fails.
     */
    setup(): Promise<void>;

    /**
     * Closes the database connection.
     * @returns {Promise<void>} A promise that resolves when the connection is closed, or rejects with an error if closing the connection fails.
     */
    close(): Promise<void>;

    /**
     * TODO: Document
     * @param table 
     * @param params 
     */
    upsert(query: string, params?: any[]): Promise<any>;

    /**
     * Executes a SELECT query by reading the query from a file.
     * @param {string} queryName - The name of the file containing the SQL query.
     * @param {any[]} [params] - Optional parameters for the SQL query.
     * @returns {Promise<any[]>} A promise that resolves with the result rows, or rejects with an error if the query fails.
     */
    selectAll(queryName: string, params?: any[]): Promise<any[]>;

    /**
     * TODO: Document
     * @param query 
     */
    getLast(query: string): Promise<any>;

    // select by id

    // update

    // delete
}
