import express from 'express';
import cors from 'cors';
import { logger, LogLevel } from "../util/logger";
import { IAppConfig } from "../interfaces/IAppConfig";
import iocContainer from '../providers/containerProvider';
import { isTruthy } from '../util/isTruthy';
import { UserController } from '../api/controller/UserController';
import { IDatabase } from '../interfaces/IDatabase';
import { User } from '../api/model/User';
import { generateUUID } from '../util/uuid';

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

            logger(`App: ${this.config.name} started successfully!`, LogLevel.DEBUG);
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
                this.app.options('*', cors()); // TODO: Enable preflight / options & make this more secure.
                this.app.use(express.json());
                this.server = this.app.listen(this.config.port, () => console.log(`App running on: http://localhost:${this.config.port}/`));

                logger(`App: ${this.config.name} successfully initialized the express server.`, LogLevel.DEBUG);
                resolve();
            } catch (error: Error | any) {
                logger('App: Error initializing express:', LogLevel.CRITICAL, error);
                reject(error);
            }
        });
    }

    private async initRoutes(): Promise<void> {
        this.config.routeInitEvent.emitRouteInit(this.app);
    }
}