import { IDatabase } from "../../interfaces/IDatabase";
import queries from "../../sql/queries";
import { IUserRepo } from "../interfaces/IUserRepo";
import { User } from "../model/User";

export class UserRepo implements IUserRepo {
    private readonly TABLE = 'users';
    private _db: IDatabase;

    /**
     * @param {Database} db - The database object.
     */
    constructor(db: IDatabase) {
        this._db = db;
    }

    async upsert(params: User[]): Promise<number> {
        const placeholders = params.map(() => queries.users.placeholders).join(',');
        let query = `${queries.users.insert} ${placeholders} ${queries.users.onConflict}`;

        return this._db.upsert(query, params);
    }

    /**
     * Gets all users.
     * @returns {Promise<User[]>} - The requested users.
     */
    async getAll(): Promise<User[]> {
        return this._db.selectAll(queries.users.select_all);
    }
}