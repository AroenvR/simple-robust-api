import express from 'express';
import cors from 'cors';
import { logger, LogLevel } from "../util/logger";
import { IAppConfig } from "../interfaces/IAppConfig";
import iocContainer from '../providers/containerProvider';
import { isTruthy } from '../util/isTruthy';
import { UserController } from '../api/controller/UserController';

export class App {
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

            logger(`App: ${this.config.name} started successfully!`, LogLevel.DEBUG);
        } catch (error: Error | any) {
            logger('App: Error starting the app:', LogLevel.CRITICAL, error);
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

    private async initServer(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.app.options('*', cors()); // TODO: Enable preflight / options & make this more secure.
                this.app.use(express.json());
                this.server = this.app.listen(this.config.port, () => console.log(`App running on: http://localhost:${this.config.port}/`));
                resolve();
            } catch (error: Error | any) {
                logger('App: Error initializing express:', LogLevel.CRITICAL, error);
                reject(error);
            }
        });
    }
}

// export class App {
//     private config: IAppConfig;
//     // private app: express.Application = express();
//     // private server: any;

//     constructor(config: IAppConfig) {
//         this.config = config;
//     }

//     async start(): Promise<void> {
//         try {
//             await Promise.all([
//                 this.initDatabase(),
//                 // this.initServer(),
//             ])
//             // .then(this.initRoutes);

//             logger(`App: ${this.config.name} started successfully.`, LogLevel.DEBUG);
//         } catch (error: Error | any) {
//             logger('App: Error starting the app:', LogLevel.CRITICAL, error);
//             throw new Error("App: Could not start the application.");
//         }
//     }

//     async stop(): Promise<void> {
//         try {
//             await Promise.all([
//                 // this.server.close(),
//                 this.config.database.close(),
//             ]);

//             logger(`App: ${this.config.name} stopped successfully.`, LogLevel.DEBUG);
//         } catch (error: Error | any) {
//             logger('App: Error stopping the app:', LogLevel.ERROR, error);
//         }
//     }

//     private async initDatabase(): Promise<void> {
//         return new Promise((resolve, reject) => {
//             try {
//                 this.config.database.connect();
//                 this.config.database.setup();

//                 logger(`App: ${this.config.name} successfully set up the database.`, LogLevel.DEBUG);
//                 resolve();
//             } catch (error: Error | any) {
//                 logger('App: Error initializing the app database:', LogLevel.CRITICAL, error);
//                 reject(error);
//             }
//         });
//     }

//     // private async initServer(): Promise<void> {
//     //     return new Promise((resolve, reject) => {
//     //         try {
//     //             this.app.options('*', cors()); // TODO: Enable preflight / options & make this more secure.
//     //             this.app.use(express.json());
//     //             this.server = this.app.listen(this.config.port, () => console.log(`App running on: http://localhost:${this.config.port}/`));
//     //             resolve();
//     //         } catch (error: Error | any) {
//     //             logger('App: Error initializing express:', LogLevel.CRITICAL, error);
//     //             reject(error);
//     //         }
//     //     });
//     // }

//     // private initRoutes(): void {
//     //     const userController = new UserController(iocContainer.UserService);

//     //     this.app.get('/users', async (req, res) => {
//     //         res.setHeader('Access-Control-Allow-Origin', this.config.port);

//     //         // TODO: Authentication.

//     //         logger('GET for /users got called', LogLevel.DEBUG);

//     //         const userController = new UserController(iocContainer.UserService);
//     //         const users = await userController.getAll();

//     //         if (isTruthy(users)) res.status(200).json(users);
//     //         else res.status(404).json({ message: 'No users found.' }); // TOOD: Better error handling.
//     //     });

//     //     this.app.post('/users/upsert', async (req, res) => {
//     //         res.setHeader('Access-Control-Allow-Origin', this.config.port);

//     //         // TOOD: Authentication.

//     //         const userDtos = req.body;

//     //         try {
//     //             const result = await userController.upsert(userDtos);
//     //             res.status(201).json(result);
//     //         } catch (error) {
//     //             res.status(400).json({ message: 'Error upserting users.' }); // TODO: Better error handling.
//     //         }
//     //     });
//     // }
// }