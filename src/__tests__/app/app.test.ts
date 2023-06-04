import App from "../../app/App";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import axios from "axios";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";

/**
 * Integration test for the Users API.
 */
describe('Users API', () => {
    let app: App;
    const baseUrl = `http://localhost:${testServerConfig.app.port}/`;
    const origin = 'http://test.com';

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

    test('greets us', async () => {
        const response = await axios.get(baseUrl, {
            headers: {
                'Content-Type': 'application/json',
                Origin: origin
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toEqual(`Hello from ${testServerConfig.app.name}!`);
    });
});