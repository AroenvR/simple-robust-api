import App from './domain/App';
import Container from './domain/Container';
import { serverConfig } from './serverConfig';
import Logger from './util/Logger';

console.log('--- Starting the application ---');

const iocContainer = new Container(serverConfig);
iocContainer.initContainer();

const app = iocContainer.get(App);
app.start();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    Logger.instance.debug('Process: Received SIGINT. Shutting down gracefully...');

    await app.stop()
        .catch((err) => {
            Logger.instance.critical('Process SIGINT: Error stopping the app:', err);
        });

    process.exit(0);
});

process.on('SIGTERM', async () => {
    Logger.instance.debug('Process: Received SIGTERM. Shutting down gracefully...');

    await app.stop()
        .catch((err) => {
            Logger.instance.critical('Process SIGTERM: Error stopping the app:', err);
        });

    process.exit(0);
});