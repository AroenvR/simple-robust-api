import { IEntity } from "../model/IEntity";

export interface IDTO extends IEntity {
    isValid(): boolean;
    fromData(data: any): IDTO;
}
