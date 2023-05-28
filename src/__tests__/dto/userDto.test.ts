import { UserDTO } from '../../api/dto/UserDTO';
import ValidationError from '../../util/errors/ValidationError';
import { generateUUID } from '../../util/uuid';

describe('UserDTO', () => {
    let userDTO: UserDTO;

    beforeEach(() => {
        userDTO = new UserDTO();
    });

    // --------------------

    test('UUID and Name should be null initially', () => {
        expect(() => userDTO._uuid).toThrow(Error);
        expect(() => userDTO._name).toThrow(Error);
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

        expect(userDTO.isValid()).toBe(true);
    });

    // --------------------

    test('isValid should throw error for invalid Name', () => {
        userDTO._uuid = generateUUID();
        userDTO._name = 'A'.repeat(256); // 256 characters is over the limit

        expect(() => {
            userDTO.isValid();
        }).toThrow(ValidationError);
    });

    // --------------------

    test('isValid should throw error for invalid UUID', () => {
        userDTO._uuid = 'invalid-uuid';
        userDTO._name = 'John Doe';

        expect(() => {
            userDTO.isValid();
        }).toThrow(ValidationError);
    });

    // --------------------

    test('fromData should correctly populate UserDTO', () => {
        const data = {
            id: 1,
            uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            name: 'John Doe',
        };

        userDTO.fromData(data);

        expect(userDTO._id).toBe(data.id);
        expect(userDTO._uuid).toBe(data.uuid);
        expect(userDTO._name).toBe(data.name);
    });
});
