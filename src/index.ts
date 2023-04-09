import iocContainer from './providers/containerProvider';

const app = iocContainer.App;
app.start();

// Handle graceful shutdown

process.on('SIGINT', async () => {
    console.log('App: Received SIGINT. Shutting down gracefully...');
    await app.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('App: Received SIGTERM. Shutting down gracefully...');
    await app.stop();
    process.exit(0);
});