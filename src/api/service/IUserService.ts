import { UserDTO } from "../dto/UserDTO";
import { IService } from "./IService";

export interface IUserService extends IService {
    getByIds: (ids: number[]) => Promise<UserDTO[]>;
    getByUuids: (uuids: string[]) => Promise<UserDTO[]>;
}