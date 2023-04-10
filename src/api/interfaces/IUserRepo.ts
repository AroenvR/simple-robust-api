import { IRepository } from "../../interfaces/IRepository";
import { User } from "../model/User";

/**
 * IUserRepo interface extends IRepository and represents the structure for the user repository.
 * It contains a specific method to upsert user records.
 */
export interface IUserRepo extends IRepository {
    upsert(params?: User[]): Promise<number>;
}