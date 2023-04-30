import { UserController } from "../api/controller/UserController";
import { UserRepo } from "../api/repo/UserRepo";
import { UserService } from "../api/service/UserService";
import { IServerConfig } from "../interfaces/IServerConfig";
import { PubSub } from "../util/PubSub";
import { RouteInitEvent } from "../util/RouteInitEvent";
import { TaskProcessor } from "../util/TaskProcessor";
import Logger from "../util/Logger";
import App from "./App";
import Database from "./Database";

/**
 * A function that creates an instance of a service with the given container.
 * @template T - The type of the service to be created.
 * @param container - The container used to create the service instance.
 * @returns An instance of the service.
 */
interface ServiceFactory<T> {
    (container: Container): T;
}

/**
 * A constructor function that creates an instance of a service with the given arguments.
 * @template T - The type of the service to be created.
 */
type ServiceIdentifier<T> = new (...args: any[]) => T;

/**
 * Container class is responsible for managing dependencies and services.
 * It provides methods to register and get instances of services.
 */
export default class Container {
    private config: IServerConfig;
    private services: Map<ServiceIdentifier<any>, any>;
    private logger: Logger;

    /**
     * Creates a new instance of the Container class.
     * @param config - The configuration object for the container.
     */
    constructor(config: IServerConfig) {
        this.config = config;
        this.services = new Map();

        // Initialize the logger first
        this.logger = Logger.create({ ...config.logger });
        this.logger.debug("Container: Container created successfully.");
    }

    /**
     * Registers a new service with the container.
     * @param key - The service identifier.
     * @param factory - The factory function that creates the service instance.
     * @returns The container instance.
     * @throws { Error } - If a service with the same key has already been registered.
     */
    register<T>(key: ServiceIdentifier<T>, factory: ServiceFactory<T>): Container {
        if (this.services.has(key)) {
            this.logger.error(`Container: Service '${key.name}' is already registered.`);
            throw new Error(`Service '${key.name}' is already registered.`);
        }

        const instance = factory(this);
        this.services.set(key, instance);
        this.logger.debug(`Container: ${key.name} service created successfully.`);

        return this;
    }

    /**
     * Returns the service instance associated with the specified key.
     * @param key - The service identifier.
     * @returns The service instance.
     * @throws { Error } - If the service is not found.
     */
    get<T>(key: ServiceIdentifier<T>): T {
        const instance = this.services.get(key);

        if (!instance) {
            throw new Error(`Service '${key.name}' not found.`);
        }

        return instance;
    }

    /**
     * Returns the configuration object for the container.
     * @returns The configuration object.
     */
    getConfiguration(): IServerConfig {
        return this.config;
    }

    /**
     * This method initializes the container by registering various services and dependencies that the application requires.
     */
    initContainer(): void {
        this.logger.debug("Container: Initializing container.");

        try {
            // Util
            this.services.set(Logger, this.logger); // Use the already initialized logger
            this.register(RouteInitEvent, () => new RouteInitEvent());
            this.register(PubSub, (c) => new PubSub());
            this.register(TaskProcessor, (c) => new TaskProcessor({ ...c.getConfiguration().tasks }));

            // Database
            this.register(Database, (c) => new Database({ ...c.getConfiguration().database }));

            // Repo's
            this.register(UserRepo, (c) => new UserRepo(c.get(Database)));

            // Services
            this.register(UserService, (c) => new UserService(c.get(UserRepo), c.get(TaskProcessor), c.get(PubSub)));

            // Controllers
            this.register(UserController, (c) => new UserController(c.get(UserService), c.get(RouteInitEvent)));

            // App
            this.register(App, (c) => new App({ ...c.getConfiguration().app, database: c.get(Database), routeInitEvent: c.get(RouteInitEvent) }));

        } catch (error) {
            this.logger.error(`Container: Error initializing container!`);
            throw error;
        }
    }
}
