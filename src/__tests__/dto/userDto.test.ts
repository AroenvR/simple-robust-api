import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { UserDTO } from '../../api/dto/UserDTO';
import { UserSchema } from '../../api/dto/UserSchema';
import ValidationError from '../../util/errors/ValidationError';
import { generateUUID } from '../../util/uuid';
import Logger from '../../util/logging/Logger';
import { testServerConfig } from '../testServerConfig';

describe('UserDTO', () => {
    let userDTO: UserDTO;

    beforeEach(() => {
        userDTO = new UserDTO();
    });

    // --------------------

    test('Set UUID and Name', () => {
        const testUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // A valid UUID
        const testName = 'John Doe';
        userDTO._uuid = testUuid;
        userDTO._name = testName;

        expect(userDTO._uuid).toBe(testUuid);
        expect(userDTO._name).toBe(testName);
    });

    // --------------------

    test('Falsy UUID should throw error', () => {
        expect(() => {
            userDTO._uuid = '';
        }).toThrow(Error);
    });

    // --------------------

    test('Falsy Name should throw error', () => {
        expect(() => {
            userDTO._name = '';
        }).toThrow(Error);
    });

    // --------------------

    test('isValid should return true for valid UserDTO', () => {
        userDTO._uuid = generateUUID();
        userDTO._name = 'John Doe';

        const dtoCopy = { ...userDTO };

        expect(userDTO.isValid(dtoCopy)).toBe(true);
    });

    // --------------------

    test('JSON schema validation should work correctly', () => {
        const ajv = new Ajv();
        addFormats(ajv);

        const validUserDTO = {
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            name: 'John Doe',
        };

        const invalidUserDTO = {
            uuid: 'invalid-uuid',
            name: 'A'.repeat(256),
        };

        expect(ajv.validate(UserSchema, validUserDTO)).toBe(true);
        expect(ajv.validate(UserSchema, invalidUserDTO)).toBe(false);
    });

    // --------------------

    test('isValid should throw error for unexpected data types or invalid data', () => {
        const invalidDataTypes = [123, {}, [], true, 'invalid-uuid', 'Hello69', 'A'.repeat(256)];

        invalidDataTypes.forEach((value) => {
            // Bypass setters by directly setting private properties
            (userDTO as any).uuid = generateUUID();
            (userDTO as any).name = 'John Doe';

            // Test unexpected data types for UUID
            (userDTO as any).uuid = value;
            expect(() => {
                const dtoCopy = { ...userDTO };
                userDTO.isValid(dtoCopy);
            }).toThrow(ValidationError);

            // Reset UUID and test unexpected data types for Name
            (userDTO as any).uuid = generateUUID();
            (userDTO as any).name = value;
            expect(() => {
                const dtoCopy = { ...userDTO };
                userDTO.isValid(dtoCopy);
            }).toThrow(ValidationError);
        });
    });

    // --------------------

    test('isValid should throw error for potential SQL injection attempts', () => {
        const sqlInjectionStrings = [
            "John Doe'; DROP TABLE users; --",
            "John Doe' OR '1'='1",
            "John Doe' AND SLEEP(5); --",
        ];

        sqlInjectionStrings.forEach((value) => {
            userDTO._uuid = generateUUID();
            userDTO._name = value;

            expect(() => {
                const dtoCopy = { ...userDTO };
                userDTO.isValid(dtoCopy);
            }).toThrow(ValidationError);
        });
    });

    // --------------------

    test('isValid should throw error for potential XSS attempts', () => {
        const xssStrings = [
            '<script>alert("XSS");</script>',
            '<img src="x" onerror="alert(\'XSS\');" />',
            'John Doe<iframe src="http://evil.com"></iframe>',
        ];

        xssStrings.forEach((value) => {
            userDTO._uuid = generateUUID();
            userDTO._name = value;

            expect(() => {
                const dtoCopy = { ...userDTO };
                userDTO.isValid(dtoCopy);
            }).toThrow(ValidationError);
        });
    });

    // --------------------

    test('isValid should handle different Unicode character sets', () => {
        const unicodeNames = [
            'Иван Иванович', // Cyrillic
            '张伟', // Chinese
            'الإمام الحسين', // Arabic
        ];

        unicodeNames.forEach((value) => {
            userDTO._uuid = generateUUID();
            userDTO._name = value;

            expect(() => {
                const dtoCopy = { ...userDTO };
                userDTO.isValid(dtoCopy);
            }).toThrow(ValidationError);
        });
    });

    // --------------------

    test('isValid should not leak sensitive information in error messages', () => {
        const sensitiveInfoString = "John Doe'; SELECT * FROM users; --";

        userDTO._uuid = generateUUID();
        userDTO._name = sensitiveInfoString;
        const dtoCopy = { ...userDTO };

        try {
            userDTO.isValid(dtoCopy);
        } catch (error: any) {
            expect(error).toBeInstanceOf(ValidationError);

            // Check that the error message does not contain sensitive information
            expect(error.message).not.toContain(sensitiveInfoString);

            // Check that the error message does not contain a stack trace
            expect(error.message).not.toContain('at ');
        }
    });

    // --------------------

    test('fromData should correctly populate UserDTO', () => {
        const data = {
            id: 1,
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            name: 'John Doe',
        };

        expect(userDTO.fromData(data)).toBeInstanceOf(UserDTO);

        expect(userDTO._id).toBe(data.id);
        expect(userDTO._uuid).toBe(data.uuid);
        expect(userDTO._name).toBe(data.name);
    });
});
