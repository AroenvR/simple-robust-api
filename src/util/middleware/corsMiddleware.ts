import cors, { CorsOptions } from 'cors';
import { ICorsConfig } from './ICorsConfig';
import Logger from '../logging/Logger';

/**
 * SECURITY
 * Configures CORS (Cross-Origin Resource Sharing) options for the server.
 * @param config The configuration options for CORS.
 * @return A middleware function that can be used by the server to enable CORS with the specified configuration.
 */
export const corsMiddleware = (config: ICorsConfig) => {
    Logger.instance.debug('CORS: Configuring CORS middleware.');

    const allowList = config.originAllowList;

    const corsOptions: CorsOptions = {
        origin: (requestOrigin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
            if (allowList.indexOf(requestOrigin!) !== -1) {
                callback(null, true);
            } else {
                Logger.instance.warn(`CORS: A Disallowed origin is sending a request: ${requestOrigin}`);
                callback(new Error('Origin not allow listed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: [],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    };

    return cors(corsOptions);
}