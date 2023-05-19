import axios from 'axios';
import App from '../../app/App';
import { testServerConfig } from '../testServerConfig';
import { generateUUID } from '../../util/uuid';
import { ContainerWrapper } from '../../ioc/ContainerWrapper';
import { TYPES } from '../../ioc/TYPES';

describe('sanitizeMiddleware', () => {
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

    const uuid = generateUUID();
    const unsanitizedName = '<script>alert("Hello John Doe!")</script>';
    const sanitizedName = '&lt;script&gt;alert(\"Hello John Doe!\")&lt;/script&gt;';

    // ----------------------------

    test('should sanitize request body', async () => {
        const payload = [
            {
                uuid: uuid,
                name: unsanitizedName
            }
        ];
        const response = await axios.post(`http://localhost:${testServerConfig.app.port}/users`, payload, {
            headers: {
                'Content-Type': 'application/json',
                Origin: 'http://test.com'
            }
        });

        expect(response.status).toBe(201);

        const users = response.data;
        expect(users[0].uuid).toBe(payload[0].uuid);
        expect(users[0].name).toBe(sanitizedName);
    });

    // ----------------------------

    // TODO: Re-enable this endpoint and test for sanitizing of query params.

    // test('should sanitize request query', async () => {
    //     const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, {
    //         params: {
    //             name: unsanitizedName
    //         },
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Origin: 'http://test.com'
    //         }
    //     });

    //     expect(response.status).toBe(200);

    //     const users = response.data;
    //     expect(users.length).toBe(1);
    //     expect(users[0].uuid).toBe(uuid);
    //     expect(users[0].name).toBe(sanitizedName);
    // });
});
