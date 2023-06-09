import { UserDTO } from "../../dto/users/UserDTO";
import { IService } from "../IService";

export interface IUserService extends IService {
    getByIds: (ids: number[]) => Promise<UserDTO[]>;
    getByUuids: (uuids: string[]) => Promise<UserDTO[]>;
    getByNames: (names: string[]) => Promise<UserDTO[]>;
}