import { Knex } from "knex";

/**
 * IRepository interface represents the basic structure for a repository.  
 * It contains methods to upsert and select all from the database.
 */
export interface IRepository {
    readonly name: string;
    readonly TABLE: string;

    /**
     * Inserts or updates one or more records in the database.
     * @abstract
     * @param params - An array of objects representing the records to insert or update.
     * @returns A Promise that resolves to an array of objects representing the inserted or updated records.
     */
    upsert(params?: any[]): Promise<any[]>;

    /**
     * Retrieves all records from the database.
     * @abstract
     * @returns A Promise that resolves to an array of objects representing the retrieved records.
     */
    selectAll(): Promise<any[]>;
}