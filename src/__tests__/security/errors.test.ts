import App from "../../app/App";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";
import { TYPES } from "../../ioc/TYPES";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import axios from "axios";

// TODO: Fix
describe('Users API Error Handling', () => {
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

    test('handles an HTTP GET request for a non-existent user by UUID', async () => {

        try {
            await axios.get(`http://localhost:${testServerConfig.app.port}/users?uuids=${generateUUID()},${generateUUID()}`, {
                headers: {
                    Origin: 'http://test.com'
                }
            });
        } catch (error: any) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.message).toBe('Requested resource not found.');
        }
    });

    // ----------------------------

    test('handles an HTTP POST request with invalid UUID', async () => {
        const payload = [
            {
                uuid: 'invalid-uuid',
                name: 'John Doe'
            },
            {
                uuid: generateUUID(),
                name: 'Jane Doe'
            }
        ];

        try {
            await axios.post(`http://localhost:${testServerConfig.app.port}/users`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Origin: 'http://test.com'
                }
            });

            fail('The API call should have thrown an error, but it did not.');
        } catch (error: any) {
            expect(error.response.status).toBe(403);
            expect(error.response.data.message).toBe('Validation failed.');
        }
    });
});
