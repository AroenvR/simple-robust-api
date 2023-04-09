/**
 * Sleeps for a given number of milliseconds.
 * @param ms to sleep for.
 * @returns a promise that resolves after ms milliseconds.
 */
export const sleepAsync = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));