import validator from 'validator';
import DataTransferObject from "./DataTransferObject";
import { isTruthy } from "../../util/isTruthy";
import { IUser } from "../model/IUser";
import ValidationError from '../../util/errors/ValidationError';

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
    private uuid: string | null = null;
    private name: string | null = null;

    constructor(user?: IUser) {
        super();

        if (user) {
            this._id = user._id!;
            this.uuid = user._uuid;
            this.name = user._name;
        }
    }

    get _uuid(): string {
        if (this.uuid === null) {
            throw new Error('UserDTO: UUID is not set');
        }
        return this.uuid;
    }

    set _uuid(value: string) {
        if (!isTruthy(value)) throw Error('UserDTO: UUID must be a truthy string');
        this.uuid = value;
    }

    get _name(): string {
        if (this.name === null) {
            throw new Error('UserDTO: Name is not set');
        }
        return this.name;
    }

    set _name(value: string) {
        if (!isTruthy(value)) throw Error('UserDTO: Name must be a truthy string');
        this.name = value;
    }

    public isValid(): boolean { // TODO: Json Schema! Figure out if during or before runtime.
        if (!isTruthy(this.uuid) || !isTruthy(this.name)) throw new ValidationError('UserDTO: UUID and Name must be set');

        if (!validator.isUUID(this.uuid!, '4')) {
            throw new ValidationError('UserDTO: UUID must be a valid UUID v4 string');
        }
        if (!validator.isLength(this.name!, { min: 1, max: 255 })) {
            throw new ValidationError('UserDTO: Name must be a non-empty string with a maximum length of 255 characters');
        }

        const noSpaces = this.name!.replace(/\s/g, '');
        if (!validator.isAlpha(noSpaces)) {
            throw new ValidationError('UserDTO: Name must be a non-empty alpha-only string.');
        }

        return true;
    }

    public fromData(data: any): UserDTO {
        if (isTruthy(data.id)) this._id = data.id;
        this.uuid = data.uuid;
        this.name = data.name;
        return this;
    }
}