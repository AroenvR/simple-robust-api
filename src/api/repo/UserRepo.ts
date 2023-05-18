import { IDatabase } from "../../database/IDatabase";
import queries from "../../sql/queries";
import { IUserRepo } from "./IUserRepo";
import { User } from "../model/User";
import Logger from "../../util/Logger";
import { isTruthy } from "../../util/isTruthy";
import { UserDTO } from "../dto/UserDTO";
import NotFoundError from "../../errors/NotFoundError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc_container/IocTypes";

/**
 * UserRepo class implements IUserRepo and provides methods to interact with user records in the database.
 */
@injectable()
export class UserRepo implements IUserRepo {
    readonly name = 'UserRepo';
    private readonly TABLE = 'users';
    private _db: IDatabase;

    /**
     * @param db - The database object.
     */
    constructor(@inject(TYPES.Database) db: IDatabase) {
        this._db = db;
    }

    /**
     * Inserts a new user.
     * @param params Array of User objects.
     * @returns A Promise with the last ID of the insert operation.
     */
    async upsert(params: User[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: upserting users.`);

        const placeholders = params.map(() => queries.users.placeholders).join(',');
        let query = `${queries.users.insert} ${placeholders} ${queries.users.onConflict}`;

        try {
            const resp = await this._db.upsert(query, params);
            if (!isTruthy(resp)) throw new Error(`${this.name}: Error upserting users.`);

            return await this.selectFromIdToId(resp.changes, resp.lastId);

        } catch (error: Error | any) {
            Logger.instance.error(`${this.name}: Error upserting users:`, error);
            throw error;
        }
    }

    /**
     * Gets all users.
     * @returns A Promise with the requested users.
     */
    async getAll(): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: selecting all users.`);

        return this._db.selectMany(queries.users.select_all);
    }

    /**
     * Gets users by ids.
     * @returns A Promise with the requested users.
     */
    async selectFromIdToId(from: number, to: number): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: selecting users by ids.`);

        const query = queries.users.select_from_to;
        const params = [from, to];
        const result = this._db.selectFromIdToId(query, params);
        if (!isTruthy(result)) throw new NotFoundError('Error users not found by requested ids.');

        return result;
    }

    /**
     * Gets users by uuids.
     * @param uuids - An array of uuids.
     * @returns A Promise with the requested users.
     */
    async selectByUuids(uuids: string[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: selecting users by uuids.`);

        const placeholders = uuids.map(() => '?').join(',');
        const query = `${queries.users.select_by_uuids} (${placeholders})`;
        Logger.instance.debug(`${this.name}: query:`, query);

        const result = await this._db.selectMany(query, uuids);

        if (!isTruthy(result)) throw new NotFoundError('Error users not found by requested uuids.');

        return result;
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