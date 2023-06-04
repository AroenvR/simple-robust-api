/**
 * ajv JSON Schema for Users
 */
export const UserSchema = {
    type: 'object',
    properties: {
        uuid: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 255, pattern: '^[a-zA-Z ]+$' },
    },
    required: ['uuid', 'name'],
};