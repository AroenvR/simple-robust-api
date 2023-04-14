import cors, { CorsOptions } from 'cors';
import { ICorsConfig } from '../interfaces/ICorsConfig';
import { LogLevel, logger } from '../util/logger';

export const configuredCors = (config: ICorsConfig) => {
    const allowList = config.originAllowList;

    const corsOptions: CorsOptions = {
        origin: (requestOrigin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
            if (allowList.indexOf(requestOrigin!) !== -1) {
                callback(null, true);
            } else {
                logger(`CORS: A Disallowed origin is sending a request: ${requestOrigin}`, LogLevel.WARN)
                callback(new Error('Origin not allow listed by CORS'));
            }
        }
    };

    return cors(corsOptions);
}