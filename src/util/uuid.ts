import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new UUID
 * @returns {string} - The generated UUID
 */
export const generateUUID = (): string => {
    const uuid = uuidv4();
    return uuid;
}