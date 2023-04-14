import App from "../../domain/App";
import Container from "../../domain/Container";
import { testServerConfig } from "../testServerConfig";
import axios from "axios";

/**
 * Integration test for the Users API.
 */
describe('Users API', () => {
    let app: App;

    beforeAll(async () => {
        // Disable console.log methods before all tests
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });

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

    // TODO: Create users!

    // ----------------------------

    test('handles an HTTP GET request from whitelisted origin', async () => {
        const origin = 'http://test.com';

        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, {
            headers: {
                Origin: origin
            }
        });

        expect(response.status).toBe(200);
    });

});