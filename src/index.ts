import App from './classes/App';
import iocContainer from './providers/containerProvider';

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