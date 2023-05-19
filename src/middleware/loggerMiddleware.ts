import { Request, Response, NextFunction } from "express";
import Logger from "../util/Logger";

/**
 * Middleware that logs request and response information using startTimerLog and stopTimerLog methods.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const timer = Logger.instance.startTimerLog(`${req.method} ${req.path}`);

    // Hook into the response 'finish' event
    res.on('finish', () => {
        Logger.instance.stopTimerLog(timer, `${req.method} ${req.path} finished.`);
    });

    // Capture the original res.json function
    res.locals.originalJson = res.locals.originalJson || res.json;

    // Override res.json to capture the response body
    // @ts-ignore
    res.json = function (body) {
        Logger.instance.debug(`${req.method} ${req.path} returned status: ${res.statusCode}, body:`, body);
        res.locals.originalJson.call(res, body);
    };

    next();
}