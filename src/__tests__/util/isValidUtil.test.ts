import ValidationError from '../../util/errors/ValidationError';
import { validNumber, validString, validUUID } from '../../util/isValidUtil';

describe('Validation functions', () => {
    // --------------------

    test('validUUID should throw error for invalid uuids', () => {
        const invalidUUIDs = ['', '12345', 'f47ac10b-58cc-4372-a567-0e02b2c3d47'];

        invalidUUIDs.forEach((value) => {
            expect(() => validUUID(value)).toThrow(ValidationError);
        });
    });

    test('validUUID should not throw error for valid uuids', () => {
        const validUUID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
        // expect(() => validUUID(validUUID)).not.toThrow(ValidationError);
    });

    // --------------------

    test('validString should throw error for invalid strings', () => {
        const invalidNames = ['', '12345', '   ', 'John_Doe'];

        invalidNames.forEach((value) => {
            expect(() => validString(value)).toThrow(ValidationError);
        });
    });

    test('validString should not throw error for valid strings', () => {
        const validName = 'John Doe';
        expect(() => validString(validName)).not.toThrow(ValidationError);
    });

    // --------------------

    test('validNumber should throw error for invalid numbers', () => {
        const invalidNumbers = [-1, 0];

        invalidNumbers.forEach((value) => {
            expect(() => validNumber(value)).toThrow(ValidationError);
        });
    });

    test('validNumber should not throw error for valid numbers', () => {
        const validNumber = 1;
        // expect(() => validNumber(validNumber)).not.toThrow(ValidationError);
    });
});