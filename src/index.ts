import "reflect-metadata";
import App from './domain/App';
import { ContainerWrapper } from './ioc_container/ContainerWrapper';
import { serverConfig } from './serverConfig';
import Logger from './util/Logger';
import { TYPES } from "./ioc_container/IocTypes";
import { UserController } from "./api/controller/UserController";
import { sleepAsync } from "./util/sleep";

console.log('--- Starting the application ---');

// const iocContainer = new Container(serverConfig);
// iocContainer.initContainer();

// const app = iocContainer.get(App);
// app.start();

const containerWrapper = new ContainerWrapper(serverConfig);
containerWrapper.initContainer();

const appInstance = containerWrapper.getContainer().get<App>(TYPES.App);
appInstance.start();

sleepAsync(3000);
// const userController = containerWrapper.getContainer().get<UserController>(TYPES.UserController);
// userController.getAll();

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