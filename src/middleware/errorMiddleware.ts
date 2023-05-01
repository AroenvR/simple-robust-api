import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";
import NotFoundError from "../errors/NotFoundError";
import ValidationError from "../errors/ValidationError";
import AuthorizationError from "../errors/AuthorizationError";
import Logger from "../util/Logger";

/**
 * Middleware for handling API errors.
 */
export const errorHandlerMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    Logger.instance.debug(`Error handler middleware was triggered with an error`, err);

    const { statusCode, message } = processError(err);

    Logger.instance.error(`Middleware returning error ${statusCode}: ${message}`);
    res.status(statusCode).json({ message });
};

/**
 * Processes an ApiError and returns its status code and base message.
 * @param err - The ApiError to process
 * @returns An object containing the error's status code and base message
 */
const processError = (err: ApiError): { statusCode: number; message: string } => {
    let statusCode = 500;
    let message = 'An unknown error occurred.';

    switch (err.name) {
        case NotFoundError.name:
            statusCode = err.statusCode;
            message = new NotFoundError().message;
            break;

        case ValidationError.name:
            statusCode = err.statusCode;
            message = new ValidationError().message;
            break;

        case AuthorizationError.name:
            statusCode = err.statusCode;
            message = new AuthorizationError().message;
            break;

        default:
            if (err instanceof ApiError) {
                statusCode = err.statusCode;
                message = err.message;
            }
    }

    return { statusCode, message };
};
