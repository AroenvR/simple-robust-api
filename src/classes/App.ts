import { IAppConfig } from "../interfaces/IAppConfig";
import { logger, LogLevel } from "../util/logger";

export class App {
    private config: IAppConfig;

    constructor(config: IAppConfig) {
        this.config = config;
    }

    async start(): Promise<void> {
        try {
            await this.config.database.connect();
            await this.config.database.setup();

            logger(`App: ${this.config.name} started successfully with the database connected.`, LogLevel.DEBUG);
        } catch (error: Error | any) {
            logger('App: Error starting the app:', LogLevel.CRITICAL, error);
        }
    }
}