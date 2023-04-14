import DOMPurify from "dompurify";

/**
 * Recursively sanitizes the input value using DOMPurify. Supports strings, arrays, and objects.  
 * Other types such as numbers, undefined, and null are returned unchanged.
 * @param val value to sanitize.
 * @returns the sanitized value.
 */
export const sanitizeValue = async (val: any): Promise<any> => {
    if (typeof val === 'string') {
        return DOMPurify.sanitize(val);

    } else if (Array.isArray(val)) {
        return val.map(sanitizeValue);

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