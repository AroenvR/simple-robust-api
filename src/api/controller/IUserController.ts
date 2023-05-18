import { UserDTO } from "../dto/UserDTO";
import { IController } from "./IController";

export interface IUserController extends IController {
    handleGet(query?: any): Promise<UserDTO[]>;
    upsert(params: any): Promise<UserDTO[]>;
}