/**
 * The interface for all services.
 * @interface
 */
export interface IService {
    readonly name: string;

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
    getAll(): Promise<any[]>;
}