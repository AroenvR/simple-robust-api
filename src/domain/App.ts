import express from 'express';
import helmet from 'helmet';
import { logger, LogLevel } from "../util/logger";
import { IAppConfig } from "../interfaces/IAppConfig";
import { configuredCors } from '../middleware/configuredCors';
import { configuredHelmet } from '../middleware/configuredHelmet';

/**
 * App class is the core of the application, responsible for starting and stopping the server,
 * initializing the database, and setting up the routes.
 */
export default class App {
    private config: IAppConfig;
    private app: express.Application = express();
    private server: any;

    constructor(config: IAppConfig) {
        this.config = config;
    }

    /**
     * Starts the app.
     */
    async start(): Promise<void> {
        try {
            await Promise.all([
                this.initDatabase(),
                this.initServer(),
            ]);

            await this.initRoutes();

            logger(`--- ${this.config.name} started successfully! ---\n`, LogLevel.LOG);
        } catch (error: Error | any) {
            logger('App: Error starting the app:', LogLevel.CRITICAL, error);
        }
    }

    /**
     * Stops the app.
     */
    async stop(): Promise<void> {
        try {
            await Promise.all([
                this.server.close(),
                this.config.database.close(),
            ]);

            logger(`App: ${this.config.name} stopped successfully.`, LogLevel.DEBUG);
        } catch (error: Error | any) {
            logger('App: Error stopping the app:', LogLevel.ERROR, error);
        }
    }

    /**
     * Initializes the app database.
     */
    private async initDatabase(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.config.database.connect();
                await this.config.database.setup();

                logger(`App: ${this.config.name} successfully set up the database.`, LogLevel.DEBUG);
                resolve();
            } catch (error: Error | any) {
                logger('App: Error initializing the app database:', LogLevel.CRITICAL, error);
                reject(error);
            }
        });
    }

    /**
     * Initializes the app server.
     */
    private async initServer(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.app.use(configuredCors(this.config.corsConfig)); // Enable CORS
                this.app.use(configuredHelmet({}));                   // Enable HTTP Headers
                this.app.use(express.json());                         // Enable JSON parsing

                this.server = this.app.listen(this.config.port); // Start the server on the specified port

                logger(`App: ${this.config.name} successfully initialized the express server.`, LogLevel.DEBUG);
                logger(`App: ${this.config.name} live at => http://localhost:${this.config.port}/`, LogLevel.DEBUG)
                resolve();
            } catch (error: Error | any) {
                logger('App: Error initializing express:', LogLevel.CRITICAL, error);
                reject(error);
            }
        });
    }

    /**
     * Initializes the app routes.
     */
    private async initRoutes(): Promise<void> {
        logger(`App: ${this.config.name} initializing API routes.`, LogLevel.DEBUG);

        this.config.routeInitEvent.emitRouteInit(this.app);

        this.app.get('/', (req, res) => {
            res.send(`Hello from ${this.app.name}!`);
        });
    }
}