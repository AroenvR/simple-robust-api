import { IEntity } from "./IEntity";
import { isTruthy } from "../../util/isTruthy";

export default abstract class Entity implements IEntity {
    private id: number;

    constructor(id: number) {
        this.id = id;
    }

    get _id(): number {
        return this.id;
    }

    set _id(value: number) {
        if (!isTruthy(value, false)) throw Error('User: ID must be a truthy and positive integer');
        if (isTruthy(this.id)) throw Error('User: ID is already set');
        this.id = value;
    }
} 