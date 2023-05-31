import validator from 'validator';
import ValidationError from "./errors/ValidationError";
import { isTruthy } from './isTruthy';

export const validUUID = (uuid: string): void => {
    if (!validator.isUUID(uuid, '4')) {
        throw new ValidationError('UserDTO: UUID must be a valid UUID v4 string');
    }
}

export const validString = (name: string, max?: number): void => {
    if (isTruthy(max, false)) {
        if (!validator.isLength(name, { min: 1, max: max })) {
            throw new ValidationError('UserDTO: Name must be a non-empty string with a maximum length of 255 characters');
        }
    }
    else {
        if (!validator.isLength(name, { min: 1 })) {
            throw new ValidationError('UserDTO: Name must be a non-empty string with a maximum length of 255 characters');
        }
    }

    const noSpaces = name.replace(/\s/g, '');
    if (!validator.isAlpha(noSpaces)) {
        throw new ValidationError('UserDTO: Name must be a non-empty alpha-only string.');
    }
}

export const validNumber = (id: number): void => {
    if (!validator.isInt(id.toString(), { min: 1 })) {
        throw new ValidationError('UserDTO: ID must be a positive integer');
    }
}