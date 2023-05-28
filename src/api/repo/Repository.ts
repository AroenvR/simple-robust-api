import { Knex } from "knex";
import { IRepository } from "./IRepository";

/**
 * The base class for all repositories.
 * @abstract
 * @implements {IRepository}
 */
export abstract class Repository implements IRepository {
    public abstract readonly name: string;
    public abstract readonly TABLE: string;
    protected queryBuilder: Knex.QueryBuilder;

    constructor(queryBuilder: Knex.QueryBuilder) {
        this.queryBuilder = queryBuilder;
    }

    public abstract upsert(params?: any[]): Promise<any[]>;

    public abstract selectAll(): Promise<any[]>;
}