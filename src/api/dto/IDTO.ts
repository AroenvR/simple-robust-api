import { IEntity } from "../model/IEntity";

export interface IDTO extends IEntity {
    isValid(data: any): boolean;
    fromData(data: any): IDTO;
}
