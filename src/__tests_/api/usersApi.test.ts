import "reflect-metadata";
import App from "../../domain/App";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import axios from "axios";
import { ContainerWrapper } from "../../ioc_container/ContainerWrapper";
import { TYPES } from "../../ioc_container/IocTypes";

/**
 * Integration test for the Users API.
 */
describe('Users API', () => {
    let app: App;

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        await app.start();
    });

    afterAll(async () => {
        // Shut down the application after all tests.
        await app.stop();

        jest.restoreAllMocks();
    });

    // ----------------------------

    // TODO: Create users!

    // ----------------------------

    test('handles an HTTP POST request from whitelisted origin', async () => {
        const origin = 'http://test.com';

        const payload = [
            {
                uuid: generateUUID(),
                name: 'John Doe'
            },
            {
                uuid: generateUUID(),
                name: 'Jane Doe'
            }
        ];
        const response = await axios.post(`http://localhost:${testServerConfig.app.port}/users`, payload, {
            headers: {
                'Content-Type': 'application/json',
                Origin: origin
            }
        });

        expect(response.status).toBe(201);
    });

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