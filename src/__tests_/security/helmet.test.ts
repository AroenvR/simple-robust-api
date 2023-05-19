import axios from "axios";
import App from "../../app/App";
import { testServerConfig } from "../testServerConfig";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";

// SECURITY testing
describe('Helmet middleware', () => {
    let app: App;

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        await app.start();
    });

    afterAll(async () => {
        await app.stop();
    });

    // ----------------------------

    test('HTTP Headers should be configured', async () => {
        const requestHeaders = {
            'Origin': 'http://test.com',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TEST_BEARER_TOKEN}`
        };

        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, { headers: requestHeaders })
            .catch(err => {
                return err.response;
            });

        expect(response.headers['content-security-policy']).toContain("default-src 'self'");
        expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
        expect(response.headers['x-xss-protection']).toBe('0');
    });

});
