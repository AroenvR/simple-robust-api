import { IRepository } from "./IRepository";
import { User } from "../model/User";

/**
 * IUserRepo interface extends IRepository and represents the structure for the user repository.
 * It contains a specific method to upsert user records.
 */
export interface IUserRepo extends IRepository {
    upsert(params?: User[]): Promise<User[]>;
    selectAll(): Promise<User[]>;

    /**
     * Gets users by ids.
     * @returns A Promise with the requested users.
     */
    selectFromIdToId: (from: number, to: number) => Promise<User[]>;

    /**
     * Gets users by uuids.
     * @param uuids - An array of uuids.
     * @returns A Promise with the requested users.
     */
    selectByUuids: (uuids: string[]) => Promise<User[]>;

    /**
     * Gets users by names.
     * @param names - An array of names.
     * @returns A Promise with the requested users.
     */
    selectByNames: (names: string[]) => Promise<User[]>;

    /**
     * Gets the last user.
     * @returns A Promise with the last user.
     */
    selectLast: () => Promise<User>;
}