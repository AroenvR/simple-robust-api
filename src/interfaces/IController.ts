import { IRepository } from "./IRepository";
import { IService } from "../api/interfaces/IService";

export interface IController extends IRepository {
    name: string;
    service: IService
}