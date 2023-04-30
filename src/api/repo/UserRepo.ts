import { IDatabase } from "../../interfaces/IDatabase";
import queries from "../../sql/queries";
import { IUserRepo } from "./IUserRepo";
import { User } from "../model/User";
import Logger from "../../util/Logger";

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
        Logger.instance.info(`${this.name}: upserting users.`);

        const placeholders = params.map(() => queries.users.placeholders).join(',');
        let query = `${queries.users.insert} ${placeholders} ${queries.users.onConflict}`;

        try {
            return this._db.upsert(query, params);

        } catch (error: Error | any) {
            Logger.instance.error(`${this.name}: Error upserting users:`, error);
            throw error;
        }
    }

    /**
     * Gets all users.
     * @returns A Promise with the requested users.
     */
    async selectAll(): Promise<User[]> {
        Logger.instance.info(`${this.name}: selecting all users.`);

        return this._db.selectMany(queries.users.select_all);
    }

    /**
     * Gets the last user.
     * @returns A Promise with the last user.
     */
    async getLast(): Promise<User> {
        Logger.instance.debug(`${this.name}: getting the last one.`);

        const query = queries.users.select_current_id;
        const result = await this._db.selectOne(query);

        return result;
    }
}