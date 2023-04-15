import axios from "axios";
import App from "../../domain/App";
import Container from "../../domain/Container";
import { testServerConfig } from "../testServerConfig";

// SECURITY testing
describe('Helmet middleware', () => {
    let app: App;
    let requestHeaders: any;

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

        requestHeaders = {
            'Origin': 'http://test.com',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TEST_BEARER_TOKEN}`,
            'withCredentials': 'false',
        };
    });

    afterAll(async () => {
        // Shut down the application after all tests.
        await app.stop();

        // Re-enable console.log methods after all tests
        jest.restoreAllMocks();
    });

    // ----------------------------

    test('HTTP Headers should be configured', async () => {
        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, { headers: requestHeaders })
            .catch(err => {
                return err.response;
            });

        expect(response.headers['content-security-policy']).toContain("default-src 'self'");
        expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(response.headers['x-xss-protection']).toBe('0');

    });

});
