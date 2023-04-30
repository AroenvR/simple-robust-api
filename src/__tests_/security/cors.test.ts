import axios from "axios";
import App from "../../domain/App";
import Container from "../../domain/Container";
import { testServerConfig } from "../testServerConfig";

// SECURITY testing
describe('CORS middleware', () => {
    let app: App;

    beforeAll(async () => {
        // Disable console.log methods before all tests
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });

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
