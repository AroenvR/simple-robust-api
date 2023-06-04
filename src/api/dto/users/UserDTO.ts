import DataTransferObject from "../DataTransferObject";
import { UserSchema } from './UserSchema';
import { IUser } from "../../model/users/IUser";
import { isTruthy } from "../../../util/isTruthy";
import ValidationError from '../../../util/errors/ValidationError';
import { validNumber, validString, validUUID } from '../../../util/isValidUtil';

/**
 * Data Transfer Object representing a User entity.
 * @extends {DataTransferObject} - The parent of all DTO's.
 * @implements {IUser}
 */
export class UserDTO extends DataTransferObject implements IUser {
    private uuid: string | null = null;
    private name: string | null = null;

    get _uuid(): string {
        if (this.uuid === null) throw new Error('UserDTO: Getter called when UUID has not yet been set');
        return this.uuid;
    }

    set _uuid(value: string) {
        validUUID(value);
        this.uuid = value;
    }

    get _name(): string {
        if (this.name === null) throw new Error('UserDTO: Getter called when Name has not yet been set');
        return this.name;
    }

    set _name(value: string) {
        validString(value, 255);
        this.name = value;
    }

    protected checkSchema(data: any): boolean {
        const validationResult = UserDTO.ajv.validate(UserSchema, data);
        if (!validationResult) {
            throw new ValidationError(`UserDTO: JSON validation failed: ${UserDTO.ajv.errorsText(UserDTO.ajv.errors)}`);
        }

        return true;
    }

    public isValid(data: any): boolean {
        if (!isTruthy(data.uuid) || !isTruthy(data.name)) throw new ValidationError('UserDTO: UUID and Name must be truthy');

        this.checkSchema(data);

        if (isTruthy(data.id)) validNumber(data.id);
        validUUID(data.uuid);
        validString(data.name, 255);

        return true;
    }
}