import Ajv from 'ajv';
import addFormats from "ajv-formats";
import { UserDTO } from '../../api/dto/UserDTO';
import { UserSchema } from '../../api/dto/UserSchema';
import ValidationError from '../../util/errors/ValidationError';
import { generateUUID } from '../../util/uuid';
import { User } from '../../api/model/User';

describe('UserDTO', () => {
    let userDTO: UserDTO;

    beforeEach(() => {
        userDTO = new UserDTO();
    });

    // --------------------

    test('fromData should correctly populate UserDTO', () => {
        let dto: any;
        const data = {
            id: 1,
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            name: 'John Doe',
        };

        expect(() => {
            dto = UserDTO.fromData(data);
        }).not.toThrow(ValidationError);

        expect(dto._id).toBe(data.id);
        expect(dto._uuid).toBe(data.uuid);
        expect(dto._name).toBe(data.name);

        expect(() => {
            const user = new User(data.id, data.uuid, data.name);
            dto = UserDTO.fromData(user);
        }).not.toThrow(ValidationError);

        expect(dto._id).toBe(data.id);
        expect(dto._uuid).toBe(data.uuid);
        expect(dto._name).toBe(data.name);
    });

    // --------------------

    test('Setters for UUID and Name should correctly populate UserDTO', () => {
        const id = 1;
        const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
        const name = 'John Doe';

        expect(() => {
            userDTO._id = id;
            userDTO._uuid = uuid;
            userDTO._name = name;
        }).not.toThrow(ValidationError);

        expect(userDTO._id).toBe(id);
        expect(userDTO._uuid).toBe(uuid);
        expect(userDTO._name).toBe(name);
        expect(userDTO.isValid(userDTO)).toBe(true);
    });

    // --------------------

    test('isValid should return true for valid data', () => {
        userDTO._uuid = generateUUID();
        userDTO._name = 'John Doe';

        const copy = { ...userDTO };

        expect(userDTO.isValid(copy)).toBe(true);
    });

    // --------------------

    test('Falsy ID should throw error', () => {
        expect(() => {
            userDTO._id = 0;
        }).toThrow(ValidationError);

        expect(() => {
            userDTO._id = -69;
        }).toThrow(ValidationError);
    });

    // --------------------

    test('Falsy UUID should throw error', () => {
        expect(() => {
            userDTO._uuid = '';
        }).toThrow(ValidationError);
    });

    // --------------------

    test('Falsy Name should throw error', () => {
        expect(() => {
            userDTO._name = '';
        }).toThrow(ValidationError);
    });

    // --------------------

    test('JSON schema validation should work correctly', () => {
        const ajv = new Ajv();
        addFormats(ajv);

        const valid = {
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            name: 'John Doe',
        };

        const invalid = {
            uuid: 'invalid-uuid',
            name: 'A'.repeat(256),
        };

        expect(ajv.validate(UserSchema, valid)).toBe(true);
        expect(ajv.validate(UserSchema, invalid)).toBe(false);
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
                const copy = { ...userDTO };
                userDTO.isValid(copy);
            }).toThrow(ValidationError);

            // Reset UUID and test unexpected data types for Name
            (userDTO as any).uuid = generateUUID();
            (userDTO as any).name = value;
            expect(() => {
                const copy = { ...userDTO };
                userDTO.isValid(copy);
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
            expect(() => {
                userDTO._name = value;
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
            expect(() => {
                userDTO._name = value;
            }).toThrow(ValidationError);
        });
    });

    // --------------------

    test('fromData should handle unimplemented Unicode character sets', () => {
        const unicodeNames = [
            'Иван Иванович', // Cyrillic
            '张伟', // Chinese
            'الإمام الحسين', // Arabic
        ];

        unicodeNames.forEach((value) => {
            expect(() => {
                UserDTO.fromData({
                    id: 1,
                    uuid: generateUUID(),
                    name: value,
                });
            }).toThrow(ValidationError);
        });
    });

    // --------------------

    test('fromData should not leak sensitive information in error messages', () => {
        const sensitiveInfoString = "John Doe'; SELECT * FROM users; --";
        const data = {
            id: 1,
            uuid: generateUUID(),
            name: sensitiveInfoString,
        }

        try {
            UserDTO.fromData(data);
        } catch (error: any) {
            expect(error).toBeInstanceOf(ValidationError);

            // Check that the error message does not contain sensitive information
            expect(error.message).not.toContain(sensitiveInfoString);

            // Check that the error message does not contain a stack trace
            expect(error.message).not.toContain('at ');
        }
    });
});
