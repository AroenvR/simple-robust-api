import express, { urlencoded } from 'express';
import { IAppConfig } from "../interfaces/IAppConfig";
import { corsMiddleware } from '../middleware/corsMiddleware';
import { helmetMiddleware } from '../middleware/helmetMiddleware';
import { rateLimiterMiddleware } from '../middleware/rateLimiterMiddleware';
import Logger from '../util/Logger';
import { sanitizeMiddleware } from '../middleware/sanitize';

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
            await Promise.all([
                this.server.close(),
                this.config.database.close(),
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
        return new Promise(async (resolve, reject) => {
            try {
                await this.config.database.connect();
                await this.config.database.setup();

                Logger.instance.debug(`App: ${this.config.name} successfully set up the database.`);
                resolve();
            } catch (error: Error | any) {
                Logger.instance.critical('App: Error initializing the app database:', error);
                reject(error);
            }
        });
    }

    /**
     * SECURITY
     * Initializes the app server.
     */
    private async initServer(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.app.use(express.json()); // Enable JSON parsing
                this.app.use(urlencoded({ extended: true })); // body-parser is a core component of Express.js that parses incoming requests.

                // Add middlewares
                this.app.use(sanitizeMiddleware);                        // Sanitization
                this.app.use(corsMiddleware(this.config.corsConfig));    // CORS
                this.app.use(helmetMiddleware({}));                      // HTTP Headers
                this.app.use(rateLimiterMiddleware({}));                 // Rate Limiting

                this.server = this.app.listen(this.config.port); // Start the server on the specified port

                Logger.instance.debug(`App: ${this.config.name} successfully initialized the express server.`);
                Logger.instance.debug(`App: ${this.config.name} live at => http://localhost:${this.config.port}/`)
                resolve();
            } catch (error: Error | any) {
                Logger.instance.critical('App: Error initializing express:', error);
                reject(error);
            }
        });
    }

    /**
     * Initializes the app routes.
     */
    private async initRoutes(): Promise<void> {
        Logger.instance.debug(`App: ${this.config.name} initializing API routes.`);

        this.config.routeInitEvent.emitRouteInit(this.app);

        this.app.get('/', (req, res) => {
            res.send(`Hello from ${this.app.name}!`);
        });
    }
}