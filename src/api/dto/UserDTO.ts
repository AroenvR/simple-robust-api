import validator from 'validator';
import Ajv from 'ajv';
import addFormats from "ajv-formats";
import DataTransferObject from "./DataTransferObject";
import { UserSchema } from './UserSchema';
import { IUser } from "../model/IUser";
import { isTruthy } from "../../util/isTruthy";
import ValidationError from '../../util/errors/ValidationError';
import Logger from '../../util/logging/Logger';

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
    private static ajv: Ajv; // TODO: Add to DataTransferObject
    private uuid: string | null = null;
    private name: string | null = null;

    // FINISHED AT:
    // Working on DTO self-validation. Broke something in setting the values.
    // Check UserService for when User objects get mapped to DTO's and then validated. Validation always fails:
    // DEBUG - UserDTO: Validating JSON. this: {"uuid":"","name":""}

    constructor(user?: IUser, ajvInstance?: Ajv) {
        super();

        if (user) {
            if (user?._id !== null) this._id = user!._id;
            this.uuid = user?._uuid || '';
            this.name = user?._name || '';
        }

        if (ajvInstance) {
            UserDTO.ajv = ajvInstance;
        } else if (!UserDTO.ajv) {
            UserDTO.ajv = addFormats(new Ajv());
        }
    }

    get _uuid(): string {
        if (this.uuid === null) {
            throw new Error('UserDTO: UUID is not set');
        }
        return this.uuid;
    }

    set _uuid(value: string) {
        Logger.instance.debug(`UserDTO: Setting UUID to ${value}`);
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

    private toJSON(): object {
        return {
            uuid: this.uuid,
            name: this.name,
        };
    }

    public isValid(): boolean {
        Logger.instance.debug(`UserDTO: Validating JSON. this: ${JSON.stringify(this)}`);

        const validationResult = UserDTO.ajv.validate(UserSchema, this.toJSON());

        if (!validationResult) {
            throw new ValidationError(`UserDTO: JSON validation failed: ${UserDTO.ajv.errorsText(UserDTO.ajv.errors)}`);
        }

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
        if (isTruthy(data.id)) this._id = data.id!;
        this._uuid = data.uuid;
        this._name = data.name;
        return this;
    }
}