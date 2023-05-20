import { IRepository } from "./IRepository";
import { User } from "../model/User";
import { UserDTO } from "../dto/UserDTO";

/**
 * IUserRepo interface extends IRepository and represents the structure for the user repository.
 * It contains a specific method to upsert user records.
 */
export interface IUserRepo extends IRepository {
    upsert(params?: UserDTO[]): Promise<UserDTO[]>;
    selectByUuids: (uuids: string[]) => Promise<UserDTO[]>;
}