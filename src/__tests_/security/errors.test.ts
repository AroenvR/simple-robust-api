import App from "../../domain/App";
import Container from "../../domain/Container";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import axios from "axios";

describe('Users API Error Handling', () => {
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

        jest.restoreAllMocks();
    });

    // ----------------------------

    test('handles an HTTP GET request for a non-existent user by UUID', async () => {

        try {
            await axios.get(`http://localhost:${testServerConfig.app.port}/users/uuid/?uuid=${generateUUID()}`, {
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

    // test('handles an HTTP POST request with invalid UUID', async () => {

    //     const payload = [
    //         {
    //             uuid: 'invalid-uuid',
    //             name: 'John Doe'
    //         },
    //         {
    //             uuid: generateUUID(),
    //             name: 'Jane Doe'
    //         }
    //     ];

    //     try {
    //         await axios.post(`http://localhost:${testServerConfig.app.port}/users`, payload, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Origin: 'http://test.com'
    //             }
    //         });

    //         fail('The API call should have thrown an error, but it did not.');
    //     } catch (error: any) {
    //         expect(error.response.status).toBe(403);
    //         expect(error.response.data.message).toBe('Validation failed.');
    //     }
    // });
});
