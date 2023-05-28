import { IDatabase } from "../../database/IDatabase";
import { IUserRepo } from "./IUserRepo";
import { User } from "../model/User";
import Logger from "../../util/logging/Logger";
import { isTruthy } from "../../util/isTruthy";
import { UserDTO } from "../dto/UserDTO";
import NotFoundError from "../../util/errors/NotFoundError";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc/TYPES";

// TODO: Validate objects before inserting/updating.
// TODO: Enforce objects (such as uuid should exist).
// Caching?
// Indexing? 

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
    async upsert(params: UserDTO[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: upserting users.`);
        Logger.instance.debug(`${this.name}: upserting users:`, params);

        try {
            const resp = await this._db.upsert(this.TABLE, params);
            if (!isTruthy(resp)) throw new Error(`${this.name}: Error upserting users.`);

            const userDtos = resp.map((item: any) => {
                const dto = new UserDTO();
                dto.fromData(item);
                dto.isValid();
                return dto;
            });

            return userDtos;

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

        const resp = await this._db.selectMany(this.TABLE);
        const userDtos = resp.map((item: any) => {
            const dto = new UserDTO();
            dto.fromData(item);
            dto.isValid();
            return dto;
        });

        return userDtos;
    }

    /**
     * Gets users by ids.
     * @returns A Promise with the requested users.
     */
    async selectFromIdToId(from: number, to: number): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: selecting users by ids.`);

        const whereClause = { id: { '>=': from, '<=': to } };
        const result = await this._db.selectMany(this.TABLE, whereClause);
        if (!isTruthy(result)) throw new NotFoundError('Error users not found by requested ids.');

        return result;
    }

    /**
     * Gets users by uuids.
     * @param uuids - An array of uuids.
     * @returns A Promise with the requested users.
     */
    async selectByUuids(uuids: string[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: selecting users by UUIDs.`);

        const whereClause = { uuid: uuids };
        const result = await this._db.selectMany(this.TABLE, whereClause);

        if (!isTruthy(result)) throw new NotFoundError('Error users not found by requested uuids.');

        return result;
    }

    /**
     * Gets users by names.
     * @param names - An array of names.
     * @returns A Promise with the requested users.
     */
    async selectByName(names: string[]): Promise<UserDTO[]> {
        Logger.instance.info(`${this.name}: selecting users by names.`);

        const whereClause = { name: names };
        const result = await this._db.selectMany(this.TABLE, whereClause);

        if (!isTruthy(result)) throw new NotFoundError('Error users not found by requested names.');

        return result;
    }

    // /**
    //  * Gets the last user.
    //  * @returns A Promise with the last user.
    //  */
    // async getLast(): Promise<User> { // TODO: Look into this at some point?
    //     Logger.instance.debug(`${this.name}: getting the last one.`);

    //     const whereClause = {};
    //     const orderBy = ['id', 'desc'];
    //     const limit = 1;
    //     const result = await this._db.selectMany(this.TABLE, whereClause, orderBy, limit);
    //     if (!isTruthy(result)) throw new NotFoundError('Error getting the last user.');

    //     return result[0];
    // }
}