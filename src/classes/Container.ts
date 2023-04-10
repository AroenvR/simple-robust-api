import { IAppConfig } from "../interfaces/IAppConfig";
import { IContainerConfig } from "../interfaces/IContainerConfig";
import { IDatabaseConfig } from "../interfaces/IDatabaseConfig";
import { logger, LogLevel } from "../util/logger";

interface ServiceFactory<T> {
    (container: Container): T;
}

type ServiceIdentifier<T> = new (...args: any[]) => T;

export class Container {
    private config: IContainerConfig;
    private services: Map<ServiceIdentifier<any>, any>;

    constructor(config: IContainerConfig) {
        this.config = config;
        this.services = new Map();

        logger("Container: Container created successfully.", LogLevel.DEBUG);
    }

    /**
     * Registers a new service.
     * @param {ServiceIdentifier<T>} key - The service identifier.
     */
    register<T>(key: ServiceIdentifier<T>, factory: ServiceFactory<T>): Container {
        if (this.services.has(key)) {
            logger(`Container: Service '${key.name}' is already registered.`, LogLevel.ERROR);
            throw new Error(`Service '${key.name}' is already registered.`);
        }

        const instance = factory(this);
        this.services.set(key, instance);
        console.log(`Container: ${key.name} service created successfully.`);

        return this;
    }

    get<T>(key: ServiceIdentifier<T>): T {
        const instance = this.services.get(key);

        if (!instance) {
            throw new Error(`Service '${key.name}' not found.`);
        }

        return instance;
    }

    getConfiguration(): IContainerConfig {
        return this.config;
    }
}
