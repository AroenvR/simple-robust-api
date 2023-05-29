import { IEntity } from "./IEntity";
import { isTruthy } from "../../util/isTruthy";

export default abstract class Entity implements IEntity {
    private id: number | null;

    constructor(id: number | null) {
        this.id = id;
    }

    get _id(): number {
        if (this.id === null) throw Error('User: ID is not set');
        return this.id!;
    }

    set _id(value: number) {
        if (!isTruthy(value, false)) throw Error('User: ID must be a truthy and positive integer');
        if (this.id) throw Error('User: ID is already set');
        this.id = value;
    }


} 