import helmet, { HelmetOptions } from 'helmet';
import Logger from '../util/Logger';

/**
 * SECURITY
 * @param config 
 * @returns 
 */
export const helmetMiddleware = (config: any) => {
    Logger.instance.debug('Helmet: Configuring Helmet middleware.');

    // Create CSP Hash for meta tags: cat myscript.js | openssl dgst -sha256 -binary | openssl base64 -A
    // Check CSP strength: csp-evaluator.withgoogle.com

    const helmetConfig: HelmetOptions = {
        // ... defaultHelmetConfig,
        referrerPolicy: { policy: 'no-referrer' }
    };

    // Configure CSP
    return helmet(helmetConfig);
    // contentSecurityPolicy: {
    //     directives: {
    //         defaultSrc: ["'self'"],
    //         styleSrc: ["'self'", 'https://fonts.googleapis.com'],
    //         fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    //         imgSrc: ["'self'", 'data:'],
    //         scriptSrc: ["'self'", 'https://www.google.com/recaptcha/'],
    //         connectSrc: ["'self'"],
    //         frameSrc: ["'self'", 'https://www.google.com/recaptcha/'],
    //         objectSrc: ["'none'"],
    //         baseUri: ["'none'"],
    //         formAction: ["'self'"],
    //         frameAncestors: ["'none'"],
    //     },
    // },
    // hsts: {
    //     maxAge: 60 * 60 * 24 * 1, // 1 day in seconds
    //     includeSubDomains: true,
    //     preload: true,
    // },
    // noSniff: true,
    // });
}