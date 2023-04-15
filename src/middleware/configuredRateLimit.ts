import rateLimit from 'express-rate-limit';

/**
 * SECURITY
 * Configures and returns a rate limiter middleware for Express applications.
 * @param {any} config - Configuration object for the rate limiter middleware (currently unused).
 * @returns The rate limiter middleware with predefined settings.
 */
export const configuredRateLimiter = (config: any) => {
    const limiterOptions = {
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests, please try again later.',
        statusCode: 429,
    }

    return rateLimit(limiterOptions);
}