import validator from 'validator';
import ValidationError from "./errors/ValidationError";
import { isTruthy } from './isTruthy';

/**
 * Validates the given UUID string to ensure it's a valid UUID v4.
 * @param {string} uuid - The UUID string to be validated.
 * @throws {ValidationError} If the UUID is not valid, a ValidationError is thrown with a specific error message.
 */
export const validUUID = (uuid: string): void => {
    if (!validator.isUUID(uuid, '4')) {
        throw new ValidationError('validUUID: UUID must be a valid UUID v4 string');
    }
}

/**
 * Validates the given string to ensure it's a non-empty string with a specified maximum length, contains only alphabetical characters, and does not include spaces.
 * @param {string} name - The string to be validated.
 * @param {number} [max] - Optional maximum length for the string.
 * @throws {ValidationError} If the string is not valid, a ValidationError is thrown with a specific error message.
 */
export const validString = (name: string, max?: number): void => {
    if (isTruthy(max, false)) {
        if (!validator.isLength(name, { min: 1, max: max })) {
            throw new ValidationError('validString: The string must be a non-empty string with a maximum length of 255 characters');
        }
    }
    else {
        if (!validator.isLength(name, { min: 1 })) {
            throw new ValidationError('validString: The string must be a truthy string');
        }
    }

    const noSpaces = name.replace(/\s/g, '');
    if (!validator.isAlpha(noSpaces)) {
        throw new ValidationError('validString: The string must be an alpha-only string');
    }
}

/**
 * Validates the given number to ensure it's a positive integer.
 * @param {number} id - The number to be validated.
 * @throws {ValidationError} If the number is not valid, a ValidationError is thrown with a specific error message.
 */
export const validNumber = (id: number): void => {
    if (!validator.isInt(id.toString(), { min: 1 })) {
        throw new ValidationError('validNumber: The number must be a positive integer greater than 1');
    }
}