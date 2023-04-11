import { IEntity } from "./IEntity";

export interface IUser extends IEntity {
    uuid: string;
    name: string;
}