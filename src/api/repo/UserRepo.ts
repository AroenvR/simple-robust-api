import { IDatabase } from "../../interfaces/IDatabase";
import queries from "../../sql/queries";
import { LogLevel, logger } from "../../util/logger";
import { IUserRepo } from "../interfaces/IUserRepo";
import { User } from "../model/User";

/**
 * UserRepo class implements IUserRepo and provides methods to interact with the user records in the database.
 */
export class UserRepo implements IUserRepo {
    name = 'UserRepo';
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
    async selectAll(): Promise<User[]> {
        logger(`${this.name}: selecting all users.`, LogLevel.DEBUG);

        return this._db.selectAll(queries.users.select_all);
    }

    /**
     * Gets the last user.
     * @returns {Promise<User>} - The last user.
     */
    async getLast(): Promise<User> {
        logger(`${this.name}: getting the last one.`, LogLevel.DEBUG);

        const query = queries.users.select_current_id;
        const result = await this._db.getLast(query);

        return result;
    }
}