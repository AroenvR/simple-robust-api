import sanitizeHtml from 'sanitize-html';
import Logger from "../util/Logger";
import { Request, Response, NextFunction } from "express";
import { isTruthy } from "../util/isTruthy";
import xss from 'xss';

/**
 * Recursively sanitizes the input value using DOMPurify. Supports strings, arrays, and objects.  
 * Other types such as numbers, undefined, and null are returned unchanged.
 * @param val value to sanitize.
 * @returns the sanitized value.
 */
export const sanitizeValue = async (val: any): Promise<any> => {
    // TODO: get allowed tags and attributes from config / API

    if (typeof val === 'string') {
        let sanitized = xss(val);
        sanitized = sanitizeHtml(sanitized).trim();

        if (sanitized !== val) {
            Logger.instance.warn(`sanitizeValue: sanitization was triggered!`);
            Logger.instance.debug(`PRE-sanitize: ${val}, POST-sanitize: ${sanitized}`);
        }
        return sanitized;

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
    if (Array.isArray(obj)) {
        return await Promise.all(obj.map(sanitizeValue));
    }

    const sanitizedObj: any = {};

    for (const [key, val] of Object.entries(obj)) {
        sanitizedObj[key] = await sanitizeValue(val);
    }

    return sanitizedObj;
};

/**
 * SECURITY
 * Sanitizes incoming request data (body and query).
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

/**
 * SECURITY
 * Middleware that sanitizes server responses by intercepting the `send` and `json` methods of the response object.
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const sanitizeResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    res.locals.originalJson = res.locals.originalJson || res.json;

    // @ts-ignore
    res.send = async function sendOverride(this: Response, body?: any) {
        if (isTruthy(body) && typeof body === 'string') {
            try {
                const parsedBody = JSON.parse(body);
                const sanitizedBody = await sanitizeObject(parsedBody);
                originalSend.call(this, JSON.stringify(sanitizedBody));
            } catch (error) {
                // Not a JSON string, send as-is
                originalSend.call(this, body);
            }
        } else {
            originalSend.call(this, body);
        }
    };

    // @ts-ignore
    res.json = async function jsonOverride(this: Response, body?: any) {
        if (isTruthy(body)) {
            const sanitizedBody = await sanitizeObject(body);
            res.locals.originalJson.call(this, sanitizedBody);
        } else {
            res.locals.originalJson.call(this, body);
        }
    };

    next();
};