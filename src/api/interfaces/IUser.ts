import { IEntity } from "../../interfaces/IEntity";

export interface IUser extends IEntity {
    uuid: string;
    name: string;
}