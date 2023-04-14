import helmet, { HelmetOptions } from 'helmet';

// interface IHTTPConfig {
// }

/**
 * SECURITY
 * @param config 
 * @returns 
 */
export const configuredHelmet = (config: any) => {
    const helmetConfig: HelmetOptions = {
        // ... defaultHelmetConfig,
        referrerPolicy: { policy: 'no-referrer' }
    }


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