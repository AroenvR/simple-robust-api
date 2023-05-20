import { IEntity } from "./IEntity";

export interface IUser extends IEntity {
    _uuid: string;
    _name: string;
}