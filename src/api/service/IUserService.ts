import { UserDTO } from "../dto/UserDTO";
import { IService } from "./IService";

export interface IUserService extends IService {
    getByUuids: (uuids: string[]) => Promise<UserDTO[]>;
}