import App from './domain/App';
import Container from './domain/Container';
import { serverConfig } from './serverConfig';
import { LogLevel, logger } from './util/logger';

logger('--- Starting the application ---', LogLevel.LOG);

const iocContainer = new Container(serverConfig);
iocContainer.initContainer();

const app = iocContainer.get(App);
app.start();

// Handle graceful shutdown

process.on('SIGINT', async () => {
    console.log('\nApp: Received SIGINT. Shutting down gracefully...');
    await app.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nApp: Received SIGTERM. Shutting down gracefully...');
    await app.stop();
    process.exit(0);
});