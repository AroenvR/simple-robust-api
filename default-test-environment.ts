import NodeEnvironment from 'jest-environment-node';
import App from './src/domain/App';
import { ContainerWrapper } from './src/ioc_container/ContainerWrapper'; // Update the path to your ContainerWrapper class
import { TYPES } from './src/ioc_container/IocTypes'; // Update the path to your TYPES definition
import { testServerConfig } from './src/__tests_/testServerConfig';

class CustomJestEnvironment extends NodeEnvironment {
    public app: App;

    async setup() {
        await super.setup();

        // Initialize the container
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        // Start the application
        this.app = containerWrapper.getContainer().get<App>(TYPES.App);
        await this.app.start();
    }

    async teardown() {
        // Shut down the application
        await this.app.stop();

        // Re-enable console.log methods after all tests
        jest.restoreAllMocks();

        await super.teardown();
    }

    runScript(script: any) {
        return super.runScript(script);
    }
}

export default CustomJestEnvironment;