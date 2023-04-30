import sanitizeHtml from 'sanitize-html';
import Logger from "../util/Logger";
import { Request, Response, NextFunction } from "express";
import { isTruthy } from "../util/isTruthy";

/**
 * Recursively sanitizes the input value using DOMPurify. Supports strings, arrays, and objects.  
 * Other types such as numbers, undefined, and null are returned unchanged.
 * @param val value to sanitize.
 * @returns the sanitized value.
 */
export const sanitizeValue = async (val: any): Promise<any> => {
    // TODO: get allowed tags and attributes from config / API

    if (typeof val === 'string') {
        let sanitized = "";
        if (val.includes('<') || val.includes('>')) {
            sanitized = sanitizeHtml(val);
        } else {
            // sanitized = 
        }

        if (sanitized !== val) {
            Logger.instance.warn(`sanitizeValue: User triggered sanitization!`);
            Logger.instance.debug(`PRE-sanitize: ${val}, POST-sanitize: ${sanitized}`);
        }
        return sanitized;

    } else if (Array.isArray(val)) {
        return Promise.all(val.map(sanitizeValue));

    } else if (val !== null && typeof val === 'object') {
        return sanitizeObject(val);
    }

    return val;
};

/**
 * Recursively sanitizes all values of an object using DOMPurify.
 * The input object is not modified; a new object with sanitized values is returned.
 * @param obj object to sanitize.
 * @returns the sanitized object.
 */
export const sanitizeObject = async (obj: any) => {
    const sanitizedObj: any = {};

    for (const [key, val] of Object.entries(obj)) {
        sanitizedObj[key] = sanitizeValue(val);
    }

    return sanitizedObj;
};

/**
 * Sanitizes incoming request data (body and query) and server responses.
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const sanitizeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Sanitize req.body
    if (isTruthy(req.body)) {
        req.body = await sanitizeObject(req.body);
    }

    // Sanitize req.query
    if (isTruthy(req.query)) {
        req.query = await sanitizeObject(req.query);
    }

    next();
};

// TODO: Sanitize responses
// /**
//  * Sanitizes server responses
//  * @param {Request} req - The incoming request object
//  * @param {Response} res - The response object
//  * @param {NextFunction} next - The next middleware function in the stack
//  */
// export const sanitizeResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const originalSend = res.send;

//     res.send = function sendOverride(body?: any) {
//         if (isTruthy(body)) {
//             Promise.resolve(sanitizeObject(body)).then((sanitizedBody) => {
//                 originalSend.call(this, sanitizedBody);
//             });
//         } else {
//             originalSend.call(this, body);
//         }
//     };

//     next();
// };