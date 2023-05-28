import { IDatabase } from "../../database/IDatabase";
import { IUserRepo } from "./IUserRepo";
import { Knex } from 'knex'
import { User } from "../model/User";
import Logger from "../../util/logging/Logger";
import { inject, injectable } from "inversify";
import { TYPES } from "../../ioc/TYPES";
import { Repository } from "./Repository";

// TODO: Indexing?

/**
 * UserRepo class provides methods to interact with user records in the database.
 * @extends {Repository}
 * @implements {IRepository}
 */
@injectable()
export class UserRepo extends Repository implements IUserRepo {
    readonly name = 'UserRepo';
    readonly TABLE = 'users';

    constructor(@inject(TYPES.Database) db: IDatabase) {
        const instance = db.getInstance() as Knex;
        super(instance<User>('users'));
    }

    async upsert(params: User[]): Promise<User[]> {
        Logger.instance.info(`${this.name}: upserting users.`);
        Logger.instance.debug(`${this.name}: upserting users:`, params);

        try {
            const result = await this.queryBuilder
                .insert(params)
                .onConflict('uuid').ignore()
                .returning(['id', 'uuid', 'name']) as User[];

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
            const result = await this.queryBuilder
                .select('*') as User[];

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
            const result = await this.queryBuilder
                .select('*')
                .from(this.TABLE)
                .whereBetween('id', [from, to]) as User[];

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
            const result = await this.queryBuilder
                .select('*')
                .from(this.TABLE)
                .whereIn('uuid', uuids) as User[];

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
            const result = await this.queryBuilder
                .select('*')
                .from(this.TABLE)
                .whereIn('name', names) as User[];

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
            const result = await this.queryBuilder
                .select('*')
                .from(this.TABLE)
                .orderBy('id', 'desc')
                .limit(1) as User;

            Logger.instance.debug(`${this.name}: selected the last user. Result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error selecting the last user:`, err);
            throw err;
        }
    }
}