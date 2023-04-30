import DOMPurify from "dompurify";
import Logger from "../util/Logger";

/**
 * Recursively sanitizes the input value using DOMPurify. Supports strings, arrays, and objects.  
 * Other types such as numbers, undefined, and null are returned unchanged.
 * @param val value to sanitize.
 * @returns the sanitized value.
 */
export const sanitizeValue = async (val: any): Promise<any> => {
    // get allowed tags
    // get allowed attributes

    if (typeof val === 'string') {
        const sanitized = DOMPurify.sanitize(val);

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