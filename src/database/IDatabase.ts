/**
 * IDatabase interface represents the contract for a database class.
 * It defines the methods required for connecting, querying, closing, and setting up the database.
 */
export interface IDatabase {
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
     * Executes an upsert query.
     * @param query - The SQL query to execute.
     * @param params - The query parameters.
     */
    upsert(query: string, params?: any | any[]): Promise<any>;

    /**
     * Executes a SELECT query by reading the query from a file.
     * @param {string} query - The name of the file containing the SQL query.
     * @param {any[]} [params] - Optional parameters for the SQL query.
     * @returns A promise that resolves with the result rows, or rejects with an error if the query fails.
     */
    selectMany(query: string, params?: string[] | number[]): Promise<any[]>;

    /**
     * TODO: Document
     * @param query 
     */
    selectOne(query: string, params?: string[] | number[]): Promise<any>;

    // select by id

    /**
     * TODO: Document
     * @param query 
     * @param params 
     */
    selectFromIdToId(query: string, params?: string[] | number[]): Promise<any[]>;

    // update

    // delete
}
