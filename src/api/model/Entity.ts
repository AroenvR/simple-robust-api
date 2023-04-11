import { IEntity } from "./IEntity";
import { isTruthy } from "../../util/isTruthy";

export default abstract class Entity implements IEntity {
    private _id: number;

    constructor(id: number) {
        this._id = id;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        if (!isTruthy(value, false)) throw Error('User: ID must be a truthy and positive integer');
        if (isTruthy(this._id)) throw Error('User: ID is already set');
        this._id = value;
    }
} 