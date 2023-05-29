import { Knex } from "knex";
import { IRepository } from "./IRepository";
import { injectable } from "inversify";

/**
 * The base class for all repositories.
 * @abstract
 * @implements {IRepository}
 */
@injectable()
export abstract class Repository implements IRepository {
    public abstract readonly name: string;
    public abstract readonly TABLE: string;
    protected db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    public abstract upsert(params?: any[]): Promise<any[]>;

    public abstract selectAll(): Promise<any[]>;
}