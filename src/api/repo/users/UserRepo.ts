import { IDatabase } from "../../../database/IDatabase";
import { IUserRepo } from "./IUserRepo";
import { User } from "../../model/User";
import Logger from "../../../util/logging/Logger";
import { inject } from "inversify";
import { TYPES } from "../../../ioc/TYPES";
import { Repository } from "../Repository";
import { Knex } from "knex";

// TODO: Indexing?

/**
 * UserRepo class provides methods to interact with user records in the database.
 * @extends {Repository}
 * @implements {IRepository}
 */
export class UserRepo extends Repository implements IUserRepo {
    readonly name = 'UserRepo';
    readonly TABLE = 'users';

    constructor(@inject(TYPES.Database) db: IDatabase) {
        super(db.getInstance());
    }

    private getQueryBuilder(): Knex.QueryBuilder {
        return this.db<User>(this.TABLE);
    }

    async upsert(params: User[]): Promise<User[]> {
        Logger.instance.info(`${this.name}: upserting users.`);
        Logger.instance.debug(`${this.name}: upserting users:`, params);

        try {
            const result = await this.getQueryBuilder()
                .insert(params)
                .onConflict('uuid').ignore()
                .returning(['id', 'uuid', 'name']);

            Logger.instance.debug(`${this.name} upserted. Returning result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error upserting users:`, err);
            throw err;
        }
    }

    async selectAll(): Promise<User[]> {
        Logger.instance.info(`${this.name}: selecting all users.`);

        try {
            const result = await this.getQueryBuilder()
                .select('*')
                .orderBy('id', 'asc');

            Logger.instance.debug(`${this.name}: selected all users. Returning result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error selecting all users:`, err);
            throw err;
        }
    }

    async selectFromIdToId(from: number, to: number): Promise<User[]> {
        Logger.instance.info(`${this.name}: selecting users by ids.`);
        Logger.instance.debug(`${this.name}: selecting users by ids from: ${from} | to: ${to}`);

        try {
            const result = await this.getQueryBuilder()
                .select('*')
                .whereBetween('id', [from, to])
                .orderBy('id', 'asc');

            Logger.instance.debug(`${this.name}: selected users by ids. Result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error selecting users by ids:`, err);
            throw err;
        }
    }

    async selectByUuids(uuids: string[]): Promise<User[]> {
        Logger.instance.info(`${this.name}: selecting users by UUIDs.`);
        Logger.instance.debug(`${this.name}: selecting users by UUIDs:`, uuids);

        try {
            const result = await this.getQueryBuilder()
                .select('*')
                .whereIn('uuid', uuids)
                .orderBy('id', 'asc');

            Logger.instance.debug(`${this.name}: selected users by UUIDs. Result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error selecting users by UUIDs:`, err);
            throw err;
        }
    }

    async selectByNames(names: string[]): Promise<User[]> {
        Logger.instance.info(`${this.name}: selecting users by names.`);
        Logger.instance.info(`${this.name}: selecting users by names:`, names);

        try {
            const result = await this.getQueryBuilder()
                .select('*')
                .whereIn('name', names)
                .orderBy('id', 'asc');

            Logger.instance.debug(`${this.name}: selected users by names. Result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error selecting users by names:`, err);
            throw err;
        }
    }

    async selectLast(): Promise<User> {
        Logger.instance.info(`${this.name}: selecting the last user.`);

        try {
            const result = await this.getQueryBuilder()
                .select('*')
                .orderBy('id', 'desc')
                .limit(1);

            Logger.instance.debug(`${this.name}: selected the last user. Result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error selecting the last user:`, err);
            throw err;
        }
    }
}