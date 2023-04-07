import { IDatabase } from "../interfaces/IDatabase";
import { IRepository } from "../interfaces/IRepository";
import queries from "../sql/queries";

export class UserRepo implements IRepository {
    private _db: IDatabase;

    /**
     * @param {Database} db - The database object.
     */
    constructor(db: IDatabase) {
        this._db = db;
    }

    async upsert(params: any[]): Promise<void> {
        this._db.upsert(queries.users.upsert, params);
    }

    /**
     * Gets all users.
     * @returns {Promise<any[]>} - The requested users.
     */
    async getAll(): Promise<any[]> {
        return this._db.selectAll(queries.users.select_all);
    }
}