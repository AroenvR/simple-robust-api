import { DataTransferObject } from "../../classes/DataTransferObject";
import { isTruthy } from "../../util/isTruthy";
import { IUser } from "../interfaces/IUser";
import { User } from "../model/User";

/**
 * Data Transfer Object representing a User entity.
 *
 * @implements {IUser} - The User interface.
 * 
 * @constructor
 * @param {User} user - An **optional** User entity to create the DTO from.
 * 
 * @example
 * UserDTO user = new UserDTO();
 * user.id = 1;
 * user.name = "John Doe";
 */
export class UserDTO extends DataTransferObject implements IUser {
    private _uuid: string | null = null;
    private _name: string | null = null;

    constructor(user?: User) {
        super();

        if (user) {
            this.id = user.id;
            this._uuid = user.uuid;
            this._name = user.name;
        }
    }

    get uuid(): string {
        if (this._uuid === null) {
            throw new Error('UserDTO: UUID is not set');
        }
        return this._uuid;
    }

    set uuid(value: string) {
        if (!isTruthy(value)) throw Error('UserDTO: UUID must be a truthy string');
        if (isTruthy(this._uuid)) throw Error('UserDTO: UUID is already set');
        this._uuid = value;
    }

    get name(): string {
        if (this._name === null) {
            throw new Error('UserDTO: Name is not set');
        }
        return this._name;
    }

    set name(value: string) {
        if (!isTruthy(value)) throw Error('UserDTO: Name must be a truthy string');
        if (isTruthy(this._name)) throw Error('UserDTO: Name is already set');
        this._name = value;
    }
}