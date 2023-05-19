import ApiError from './ApiError';

/**
 * Represents a "Validation" error, with a default status code of 400.
 */
export default class ValidationError extends ApiError {
    constructor(message: string = 'Validation failed.') {
        super(message, 403);
    }
}
