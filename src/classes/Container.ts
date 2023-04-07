import { logger, LogLevel } from "../util/logger";

interface ServiceFactory<T> {
    (container: Container): T;
}

export class Container {
    private services: { [key: string]: any };
    [key: string]: any; // Index signature

    constructor() {
        this.services = {};
    }

    /**
     * Registers a service with a callback that creates the service instance.
     * @param {string} name - The name of the service.
     * @param {ServiceFactory<T>} cb - The callback function that creates the service instance.
     * @returns {Container} - The container instance, allowing for method chaining.
     */
    service<T>(name: string, cb: ServiceFactory<T>): Container {
        Object.defineProperty(this, name, {
            get: () => {
                if (!this.services.hasOwnProperty(name)) {
                    this.services[name] = cb(this);
                    logger(`Container: ${name} service created successfully.`, LogLevel.DEBUG);
                }

                return this.services[name];
            },
            configurable: true,
            enumerable: true
        });

        return this;
    }
}
