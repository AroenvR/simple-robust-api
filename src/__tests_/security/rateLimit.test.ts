import axios from "axios";
import App from "../../domain/App";
import Container from "../../domain/Container";
import { testServerConfig } from "../testServerConfig";

// SECURITY testing
describe('Rate limiter middleware', () => {
    let app: App;

    beforeAll(async () => {
        const iocContainer = new Container(testServerConfig);
        iocContainer.initContainer();

        app = iocContainer.get(App);
        await app.start();
    });

    afterAll(async () => {
        // Shut down the application after all tests.
        await app.stop();

        // Re-enable console.log methods after all tests
        jest.restoreAllMocks();
    });

    // ----------------------------

    test('should return 429 past 100 requests.', async () => {
        const requestHeaders = {
            'Origin': 'http://test.com',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TEST_BEARER_TOKEN}`
        };

        // Create 100 requests
        for (let i = 0; i < 100; i++) {
            const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, { headers: requestHeaders });
            expect(response.status).toBe(200);
        }

        // Create the 101st request and assert status code to be 429
        try {
            await axios.get(`http://localhost:${testServerConfig.app.port}/users`, { headers: requestHeaders });

        } catch (error: Error | any) {
            expect(error.response.status).toBe(429);
            expect(error.response.data).toBe('Too many requests, please try again later.');
        }
    });

});
