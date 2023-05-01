import { UserDTO } from "../../api/dto/UserDTO";
import App from "../../domain/App";
import Container from "../../domain/Container";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import axios from "axios";

/**
 * Integration test for the Users API.
 */
describe('Users API', () => {
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

    // TODO: Create users!

    // ----------------------------

    test('handles an HTTP POST request from whitelisted origin', async () => {
        const origin = 'http://test.com';

        const payload = [
            {
                uuid: generateUUID(),
                name: '<script>alert("Hello John Doe!")</script>'
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

        expect(response.status).toBe(200);
        console.log(response.data);
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