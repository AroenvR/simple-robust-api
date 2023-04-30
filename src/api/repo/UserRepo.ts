import { IDatabase } from "../../interfaces/IDatabase";
import queries from "../../sql/queries";
import { LogLevel, logger } from "../../util/old_logger";
import { IUserRepo } from "./IUserRepo";
import { User } from "../model/User";

/**
 * UserRepo class implements IUserRepo and provides methods to interact with user records in the database.
 */
export class UserRepo implements IUserRepo {
    readonly name = 'UserRepo';
    private readonly TABLE = 'users';
    private _db: IDatabase;

    /**
     * @param db - The database object.
     */
    constructor(db: IDatabase) {
        this._db = db;
    }

    /**
     * Inserts a new user.
     * @param params Array of User objects.
     * @returns A Promise with the last ID of the insert operation.
     */
    async upsert(params: User[]): Promise<number> {
        logger(`${this.name}: upserting users.`, LogLevel.DEBUG);

        const placeholders = params.map(() => queries.users.placeholders).join(',');
        let query = `${queries.users.insert} ${placeholders} ${queries.users.onConflict}`;

        return this._db.upsert(query, params);
    }

    /**
     * Gets all users.
     * @returns A Promise with the requested users.
     */
    async selectAll(): Promise<User[]> {
        logger(`${this.name}: selecting all users.`, LogLevel.DEBUG);

        return this._db.selectMany(queries.users.select_all);
    }

    /**
     * Gets the last user.
     * @returns A Promise with the last user.
     */
    async getLast(): Promise<User> {
        logger(`${this.name}: getting the last one.`, LogLevel.DEBUG);

        const query = queries.users.select_current_id;
        const result = await this._db.selectOne(query);

        return result;
    }
}