import Entity from "./Entity";
import { isTruthy } from "../../util/isTruthy";
import { IUser } from "./IUser";

export class User extends Entity implements IUser {
    private uuid: string;
    private name: string;

    constructor(id: number | null, uuid: string, name: string) {
        super(id);
        this.uuid = uuid;
        this.name = name;
    }

    get _uuid(): string {
        return this.uuid;
    }

    set _uuid(value: string) {
        if (!isTruthy(value)) throw Error('User: UUID must be a truthy string');
        if (isTruthy(this._uuid)) throw Error('User: UUID is already set');
        this.uuid = value;
    }

    get _name(): string {
        return this.name;
    }

    set _name(value: string) {
        if (!isTruthy(value)) throw Error('User: Name must be a truthy string');
        if (isTruthy(this.name)) throw Error('User: Name is already set');
        this.name = value;
    }
}