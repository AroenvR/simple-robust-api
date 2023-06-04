import { IDatabase } from "../../../database/IDatabase";
import Logger from "../../../util/logging/Logger";
import { inject } from "inversify";
import { TYPES } from "../../../ioc/TYPES";
import { Repository } from "../Repository";
import { Knex } from "knex";
import { IDiscordBotRepo } from "./IDiscordBotRepo";
import { DiscordBot } from "../../model/discordBots/DiscordBot";

/**
 * DiscordBotRepo class provides methods to interact with discord bot records in the database.
 * @extends {Repository}
 * @implements {IDiscordBotRepo}
 */
export class DiscordBotRepo extends Repository implements IDiscordBotRepo {
    readonly name = 'DiscordBotRepo';
    readonly TABLE = 'discord_bots';

    constructor(@inject(TYPES.Database) db: IDatabase) {
        super(db.getInstance());
    }

    private getQueryBuilder(): Knex.QueryBuilder {
        return this.db<DiscordBot>(this.TABLE);
    }

    async upsert(params: DiscordBot[]): Promise<DiscordBot[]> {
        Logger.instance.info(`${this.name}: upserting discord bots.`);
        Logger.instance.debug(`${this.name}: upserting discord bots:`, params);

        try {
            const result = await this.getQueryBuilder()
                .insert(params)
                .onConflict('name').ignore()
                .onConflict('tag').ignore()
                .onConflict('token').ignore()
                .returning(['name', 'tag', 'token']);

            Logger.instance.debug(`${this.name} upserted. Returning result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error upserting discord bots:`, err);
            throw err;
        }
    }

    async selectAll(): Promise<DiscordBot[]> {
        Logger.instance.info(`${this.name}: selecting all discord bots.`);

        try {
            const result = await this.getQueryBuilder()
                .select('*')
                .orderBy('id', 'asc');

            Logger.instance.debug(`${this.name}: selected all discord bots. Returning result:`, result);
            return result;

        } catch (err) {
            Logger.instance.error(`${this.name}: Error selecting all discord bots:`, err);
            throw err;
        }
    }

    // async selectFromIdToId(from: number, to: number): Promise<User[]> {
    //     Logger.instance.info(`${this.name}: selecting users by ids.`);
    //     Logger.instance.debug(`${this.name}: selecting users by ids from: ${from} | to: ${to}`);

    //     try {
    //         const result = await this.getQueryBuilder()
    //             .select('*')
    //             .whereBetween('id', [from, to])
    //             .orderBy('id', 'asc');

    //         Logger.instance.debug(`${this.name}: selected users by ids. Result:`, result);
    //         return result;

    //     } catch (err) {
    //         Logger.instance.error(`${this.name}: Error selecting users by ids:`, err);
    //         throw err;
    //     }
    // }

    // async selectByUuids(uuids: string[]): Promise<User[]> {
    //     Logger.instance.info(`${this.name}: selecting users by UUIDs.`);
    //     Logger.instance.debug(`${this.name}: selecting users by UUIDs:`, uuids);

    //     try {
    //         const result = await this.getQueryBuilder()
    //             .select('*')
    //             .whereIn('uuid', uuids)
    //             .orderBy('id', 'asc');

    //         Logger.instance.debug(`${this.name}: selected users by UUIDs. Result:`, result);
    //         return result;

    //     } catch (err) {
    //         Logger.instance.error(`${this.name}: Error selecting users by UUIDs:`, err);
    //         throw err;
    //     }
    // }

    // async selectByNames(names: string[]): Promise<User[]> {
    //     Logger.instance.info(`${this.name}: selecting users by names.`);
    //     Logger.instance.info(`${this.name}: selecting users by names:`, names);

    //     try {
    //         const result = await this.getQueryBuilder()
    //             .select('*')
    //             .whereIn('name', names)
    //             .orderBy('id', 'asc');

    //         Logger.instance.debug(`${this.name}: selected users by names. Result:`, result);
    //         return result;

    //     } catch (err) {
    //         Logger.instance.error(`${this.name}: Error selecting users by names:`, err);
    //         throw err;
    //     }
    // }

    // async selectLast(): Promise<User> {
    //     Logger.instance.info(`${this.name}: selecting the last user.`);

    //     try {
    //         const result = await this.getQueryBuilder()
    //             .select('*')
    //             .orderBy('id', 'desc')
    //             .limit(1);

    //         Logger.instance.debug(`${this.name}: selected the last user. Result:`, result);
    //         return result;

    //     } catch (err) {
    //         Logger.instance.error(`${this.name}: Error selecting the last user:`, err);
    //         throw err;
    //     }
    // }
}