import ApiError from './ApiError';

/**
 * Represents a "Not Found" error, with a default status code of 404.
 */
export default class NotFoundError extends ApiError {
    constructor(message: string = 'Requested resource not found.') {
        super(message, 404);
    }
}
