import Ajv from 'ajv';
import addFormats from "ajv-formats";
import DataTransferObject from "./DataTransferObject";
import { UserSchema } from './UserSchema';
import { IUser } from "../model/IUser";
import { isTruthy } from "../../util/isTruthy";
import ValidationError from '../../util/errors/ValidationError';
import { validNumber, validString, validUUID } from '../../util/isValidUtil';

/**
 * Data Transfer Object representing a User entity.
 *
 * @implements {IUser} - The User interface.
 * 
 * @example
 * UserDTO user = new UserDTO();
 * user._id = 1;
 * user._name = "John Doe";
 */
export class UserDTO extends DataTransferObject implements IUser {
    private static ajv: Ajv; // TODO: Add to DataTransferObject
    private uuid: string | null = null;
    private name: string | null = null;

    constructor(ajvInstance?: Ajv) {
        super();

        if (ajvInstance) {
            UserDTO.ajv = ajvInstance;
        } else if (!UserDTO.ajv) {
            UserDTO.ajv = addFormats(new Ajv());
        }
    }

    get _uuid(): string {
        if (this.uuid === null) throw new Error('UserDTO: Getter called when UUID has not yet been set');
        return this.uuid;
    }

    set _uuid(value: string) {
        if (!isTruthy(value)) throw Error('UserDTO: UUID must be a truthy string');
        this.uuid = value;
    }

    get _name(): string {
        if (this.name === null) throw new Error('UserDTO: Getter called when Name has not yet been set');
        return this.name;
    }

    set _name(value: string) {
        if (!isTruthy(value)) throw Error('UserDTO: Name must be a truthy string');
        this.name = value;
    }

    public isValid(data: any): boolean {
        const validationResult = UserDTO.ajv.validate(UserSchema, data);
        if (!validationResult) {
            throw new ValidationError(`UserDTO: JSON validation failed: ${UserDTO.ajv.errorsText(UserDTO.ajv.errors)}`);
        }

        if (!isTruthy(data.uuid) || !isTruthy(data.name)) throw new ValidationError('UserDTO: UUID and Name must be truthy');

        if (isTruthy(data.id)) validNumber(data.id);
        validUUID(data.uuid);
        validString(data.name, 255);

        return true;
    }

    public fromData(data: any): UserDTO {
        this.isValid(data);

        this._id = data.id;
        this._uuid = data.uuid;
        this._name = data.name;

        return this;
    }
}