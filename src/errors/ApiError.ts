/**
 * Abstract base class for API errors.
 * Extend this class to create custom error classes.
 */
export default abstract class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}