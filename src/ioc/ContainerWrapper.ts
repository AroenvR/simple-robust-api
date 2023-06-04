import { Container } from "inversify";
import Logger from "../util/logging/Logger";
import { TYPES } from "./TYPES";
import { PubSub } from "../util/pubSub/PubSub";
import { TaskProcessor } from "../util/taskProcessing/TaskProcessor";
import { UserRepo } from "../api/repo/users/UserRepo";
import { UserService } from "../api/service/UserService";
import { UserController } from "../api/controller/users/UserController";
import App from "../app/App";
import { IServerConfig } from "../IServerConfig";
import { IAppConfig } from "../app/IAppConfig";
import { IDatabase } from "../database/IDatabase";
import { IController } from "../api/controller/IController";
import { IService } from "../api/service/IService";
import { IRepository } from "../api/repo/IRepository";
import DatabaseFactory from "../database/DatabaseFactory";
import { SessionStorage } from "../util/sessionStorage/SessionStorage";

/**
 * `ContainerWrapper` is a class responsible for managing the application's dependencies using InversifyJS's container.  
 * It initializes and encapsulates different components of the application such as utilities, business logic, and the application itself.
 */
export class ContainerWrapper {
    private container: Container;
    private config: IServerConfig;
    private logger: Logger;
    private pubSub: PubSub;
    private taskProcessor: TaskProcessor;
    private sessionStorage: SessionStorage;

    /**
     * Constructs a new instance of the `ContainerWrapper` class.
     * @param config - An object that holds configuration settings for the application.
     */
    constructor(config: IServerConfig) {
        this.config = config;
        this.container = new Container();

        this.logger = Logger.create({ ...config.logging });
        this.pubSub = PubSub.create();
        this.taskProcessor = TaskProcessor.create({ ...config.tasks });
        this.sessionStorage = SessionStorage.create();
    }

    /**
     * Returns the InversifyJS container instance.
     * @returns The container instance.
     */
    public getContainer(): Container {
        return this.container;
    }

    /**
     * Initializes the container by binding services to their respective identifiers. 
     * It catches any errors that occur during initialization and logs them.
     */
    public initContainer(): void {
        this.logger.debug("Container: Initializing dependencies.");

        try {
            this.initUtilities();
            this.initBusinessLogic();
            this.initApplication();

            this.logger.log("Container: Initialized successfully.");
        } catch (error) {
            this.logger.error(`Container: Failed to initialize dependencies.`, error);
            throw error;
        }
    }

    /**
     * Binds utility services such as Logger, RouteInitEvent, etc., to their respective identifiers.
     */
    private initUtilities(): void {
        this.logger.debug("Container: Initializing utilities.");

        // Bind the container itself
        this.container.bind<Container>(TYPES.Container).toConstantValue(this.container);

        this.container.bind<Logger>(TYPES.Logger).toConstantValue(this.logger);
        this.container.bind<PubSub>(TYPES.PubSub).toConstantValue(this.pubSub);
        this.container.bind<TaskProcessor>(TYPES.TaskProcessor).toConstantValue(this.taskProcessor);
        this.container.bind<SessionStorage>(TYPES.SessionStorage).toConstantValue(this.sessionStorage);
    }

    /**
     * Binds business logic services such as the Database, Repositories, Services and Controllers to their respective identifiers.
     */
    private initBusinessLogic(): void {
        this.logger.debug("Container: Initializing business logic.");

        // Database
        const databaseFactory = new DatabaseFactory();
        const database = databaseFactory.createDatabase(this.config.database);
        this.container.bind<IDatabase>(TYPES.Database).toConstantValue(database);

        // User layers
        this.container.bind<IRepository>(TYPES.Repository).to(UserRepo);
        this.container.bind<IService>(TYPES.Service).to(UserService);
        this.container.bind<IController>(TYPES.Controller).to(UserController);
    }

    /**
     * Binds the application service to its identifier.
     */
    private initApplication(): void {
        this.logger.debug("Container: Initializing application.");

        this.container.bind<IAppConfig>(TYPES.IAppConfig).toConstantValue({ ...this.config.app });
        this.container.bind<App>(TYPES.App).to(App);
    }
}