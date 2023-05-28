import { Knex } from "knex";
import { IRepository } from "./IRepository";

/**
 * The base class for all repositories.
 * @abstract
 * @implements {IRepository}
 */
export abstract class Repository {
    public abstract readonly name: string;
    public abstract readonly TABLE: string;
    protected queryBuilder: Knex.QueryBuilder;

    constructor(queryBuilder: Knex.QueryBuilder) {
        this.queryBuilder = queryBuilder;
    }

    /**
     * Inserts or updates one or more records in the database.
     * @abstract
     * @param params - An array of objects representing the records to insert or update.
     * @returns A Promise that resolves to an array of objects representing the inserted or updated records.
     */
    public abstract upsert(params?: any[]): Promise<any[]>;

    /**
     * Retrieves all records from the database.
     * @abstract
     * @returns A Promise that resolves to an array of objects representing the retrieved records.
     */
    public abstract getAll(): Promise<any[]>;
}