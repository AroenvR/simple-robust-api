import Entity from "./Entity";
import { isTruthy } from "../../util/isTruthy";
import { IUser } from "./IUser";

export class User extends Entity implements IUser {
    private _uuid: string;
    private _name: string;

    constructor(id: number, uuid: string, name: string) {
        super(id);
        this._uuid = uuid;
        this._name = name;
    }

    get uuid(): string {
        return this._uuid;
    }

    set uuid(value: string) {
        if (!isTruthy(value)) throw Error('User: UUID must be a truthy string');
        if (isTruthy(this._uuid)) throw Error('User: UUID is already set');
        this._uuid = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        if (!isTruthy(value)) throw Error('User: Name must be a truthy string');
        if (isTruthy(this._name)) throw Error('User: Name is already set');
        this._name = value;
    }
}