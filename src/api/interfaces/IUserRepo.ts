import { IRepository } from "../../interfaces/IRepository";
import { User } from "../model/User";

export interface IUserRepo extends IRepository {
    upsert(params?: User[]): Promise<number>;
}