import "reflect-metadata";
import App from './domain/App';
import { ContainerWrapper } from './ioc_container/ContainerWrapper';
import { serverConfig } from './serverConfig';
import Logger from './util/Logger';
import { TYPES } from "./ioc_container/IocTypes";

console.log('--- Index: Initializing application ---');

// Initialize the container
const containerWrapper = new ContainerWrapper(serverConfig);
containerWrapper.initContainer();

// Start the application
const appInstance = containerWrapper.getContainer().get<App>(TYPES.App);
appInstance.start();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    Logger.instance.debug('Process: Received SIGINT. Shutting down gracefully...');

    await appInstance.stop()
        .catch((err) => {
            Logger.instance.critical('Process SIGINT: Error stopping the app:', err);
        });

    process.exit(0);
});

process.on('SIGTERM', async () => {
    Logger.instance.debug('Process: Received SIGTERM. Shutting down gracefully...');

    await appInstance.stop()
        .catch((err) => {
            Logger.instance.critical('Process SIGTERM: Error stopping the app:', err);
        });

    process.exit(0);
});