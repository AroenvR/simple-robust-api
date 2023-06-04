import axios from "axios";
import App from "../../app/App";
import { testServerConfig } from "../testServerConfig";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";

// SECURITY testing
describe('CORS middleware', () => {
    let app: App;
    const baseUrl = `http://localhost:${testServerConfig.app.port}/v1/users`;

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
    });

    // ----------------------------

    test('should allow correctly configured requests from listed domains', async () => {
        const requestHeaders = {
            'Origin': 'http://test.com',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TEST_BEARER_TOKEN}`
        };

        const response = await axios.get(baseUrl, { headers: requestHeaders });
        expect(response.status).toBe(200);
    });

    // ----------------------------

    test('should block requests from unlisted domains', async () => {
        const response = await axios.get(baseUrl, {
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
        const response = await axios.get(baseUrl).catch(err => {
            return err.response;
        });

        expect(response.status).toBe(500);
    });
});
