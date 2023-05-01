import ApiError from './ApiError';

/**
 * Represents an "Authorization" error, with a default status code of 401.
 */
export default class AuthorizationError extends ApiError {
    constructor(message: string = 'You shall not pass! (Unauthorized)') {
        super(message, 401);
    }
}
