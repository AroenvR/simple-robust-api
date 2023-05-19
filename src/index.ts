import "reflect-metadata";
import App from './app/App';
import { ContainerWrapper } from './ioc/ContainerWrapper';
import { serverConfig } from './serverConfig';
import Logger from './util/logging/Logger';
import { TYPES } from "./ioc/TYPES";

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