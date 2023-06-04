import express, { urlencoded } from 'express';
import { IAppConfig } from "./IAppConfig";
import { corsMiddleware } from '../util/middleware/corsMiddleware';
import { helmetMiddleware } from '../util/middleware/helmetMiddleware';
import { rateLimiterMiddleware } from '../util/middleware/rateLimiterMiddleware';
import Logger from '../util/logging/Logger';
import { sanitizeMiddleware, sanitizeResponseMiddleware } from '../util/middleware/sanitize';
import { errorHandlerMiddleware } from '../util/middleware/errorMiddleware';
import { loggerMiddleware } from '../util/middleware/loggerMiddleware';
import { Container, inject, injectable } from 'inversify';
import { TYPES } from '../ioc/TYPES';
import { IDatabase } from '../database/IDatabase';
import { IController } from '../api/controller/IController';

/**
 * App class is the core of the application, responsible for starting and stopping the server,
 * initializing the database, and setting up the routes.
 */
@injectable()
export default class App {
    private config: IAppConfig;
    private container: Container;
    private app: express.Application = express();
    private server: any;
    private database: IDatabase;
    // private routeInitEvent: RouteInitEvent;

    constructor(
        @inject(TYPES.IAppConfig) config: IAppConfig,
        @inject(TYPES.Container) container: Container,
        @inject(TYPES.Database) database: IDatabase
    ) {
        this.config = config;
        this.database = database;
        this.container = container;
    }

    /**
     * Starts the app.
     */
    async start(): Promise<void> {
        try {
            await Promise.allSettled([
                this.initDatabase(),
                this.initServer(),
            ]);

            await this.initRoutes();

            Logger.instance.debug(`
            ┌────────────────────────────────────┐
            │  -----      App Startup      ----- |
            ├────────────────────────────────────┤
            │  Name: ${this.config.name.padEnd(22)}      │
            │  Time: ${new Date().toLocaleTimeString().padEnd(22)}      │
            │  Status: Successfully started!     │
            └────────────────────────────────────┘`);

            Logger.instance.log(`App: ${this.config.name} listening on port ${this.config.port}.`);
        } catch (error: Error | any) {
            Logger.instance.error('App: Error starting the app:', error);
        }
    }

    /**
     * Stops the app.
     */
    async stop(): Promise<void> {
        Logger.instance.info(`App: ${this.config.name} shutting down...`);

        try {
            await Promise.allSettled([
                this.server.close(),
                this.database.close(),
            ]);

            Logger.instance.log(`App: ${this.config.name} successfully shut down.`);
        } catch (error: Error | any) {
            Logger.instance.error('App: Error stopping the app:', error);
        }
    }

    /**
     * Initializes the app database.
     */
    private async initDatabase(): Promise<void> {
        try {
            await this.database.connect();
            await this.database.setup();

            Logger.instance.debug(`App: ${this.config.name} successfully set up the database.`);
        } catch (error: Error | any) {
            Logger.instance.critical('App: Error initializing the app database:', error);
            throw error;
        }
    }

    /**
     * SECURITY
     * Initializes the app server.
     */
    private async initServer(): Promise<void> {
        try {
            this.app.use(express.json()); // Enable JSON parsing
            this.app.use(urlencoded({ extended: true })); // body-parser is a core component of Express.js that parses incoming requests.

            // Add middlewares
            this.app.use(helmetMiddleware({}));                      // HTTP Headers
            this.app.use(sanitizeMiddleware);                        // Request Sanitization
            this.app.use(corsMiddleware(this.config.corsConfig));    // CORS
            this.app.use(rateLimiterMiddleware({}));                 // Rate Limiting
            this.app.use(sanitizeResponseMiddleware);                // Response Sanitization
            this.app.use(loggerMiddleware)                           // Logging

            this.server = this.app.listen(this.config.port); // Start the server on the specified port

            Logger.instance.debug(`App: ${this.config.name} successfully initialized the Express server.`);
            Logger.instance.debug(`App: ${this.config.name} live at => http://localhost:${this.config.port}/`);
        } catch (error: Error | any) {
            Logger.instance.critical('App: Error initializing Express:', error);
            throw error;
        }
    }

    /**
     * Initializes the app routes.
     */
    private async initRoutes(): Promise<void> {
        Logger.instance.debug(`App: ${this.config.name} initializing API routes.`);

        const baseRouter = express.Router();

        const controllers = this.container.getAll<IController>(TYPES.Controller);
        controllers.forEach((controller) => {
            const router = controller.initRoutes();
            baseRouter.use(router);
        });

        // API Version 1
        this.app.use('/v1/', baseRouter);

        this.app.get('/', (req, res) => {
            res.status(200).json({ message: `Hello from ${this.config.name}!` });
        });

        this.app.use(errorHandlerMiddleware); // Error handling middleware
    }
}