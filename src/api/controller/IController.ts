import { IRepository } from "../repo/IRepository";
import { IService } from "../service/IService";

export interface IController extends IRepository {
    readonly name: string;
    service: IService
}