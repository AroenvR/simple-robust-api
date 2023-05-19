import axios from "axios";
import App from "../../app/App";
import { testServerConfig } from "../testServerConfig";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";

// SECURITY testing
describe('CORS middleware', () => {
    /*
    let app: App;

  beforeAll(() => {
    app = global.app;
  });
    */
    let app: App;

    beforeAll(async () => {
        // Initialize the container
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        // Start the application
        app = containerWrapper.getContainer().get<App>(TYPES.App);
        await app.start();
    });

    afterAll(async () => {
        // Shut down the application after all tests.
        await app.stop();

        // Re-enable console.log methods after all tests
        jest.restoreAllMocks();
    });

    // ----------------------------

    test('should allow correctly configured requests from listed domains', async () => {
        const requestHeaders = {
            'Origin': 'http://test.com',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TEST_BEARER_TOKEN}`
        };

        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, { headers: requestHeaders });
        expect(response.status).toBe(200);
    });

    // ----------------------------

    test('should block requests from unlisted domains', async () => {
        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, {
            headers: {
                Origin: 'http://www.unknown.com'
            }
        }).catch(err => {
            return err.response;
        });

        expect(response.status).toBe(500);
    });

    // ----------------------------

    test('should block requests without an Origin header', async () => {
        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`).catch(err => {
            return err.response;
        });

        expect(response.status).toBe(500);
    });
});
