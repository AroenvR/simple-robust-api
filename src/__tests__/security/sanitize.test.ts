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

    const johnUUID = generateUUID();

    const xssName = '<script>alert("Hello John Doe!")</script>';
    const xssSanitized = '&lt;script&gt;alert(\"Hello John Doe!\")&lt;/script&gt;';

    const sqlInjectionName = "' OR 1=1 --";
    const sqlSanitized = "'' OR 1=1 --";

    // ----------------------------

    test('should sanitize XSS request body', async () => {
        const payload = [
            {
                uuid: johnUUID,
                name: xssName
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
        expect(users[0].name).toBe(xssSanitized);
    });

    // ----------------------------

    test('should sanitize SQL Injection request body', async () => {
        const payload = [
            {
                uuid: generateUUID(),
                name: sqlInjectionName
            }
        ];
        const response = await axios.post(`http://localhost:${testServerConfig.app.port}/users`, payload, {
            headers: {
                'Content-Type': 'application/json',
                Origin: 'http://test.com'
            }
        });

        console.log("payload", payload);
        console.log("response", response.data);

        expect(response.status).toBe(201);

        const users = response.data;
        expect(users[1].uuid).toBe(payload[0].uuid);
        expect(users[1].name).toBe(sqlSanitized);
    });

    // TODO: Re-enable this endpoint and test for sanitizing of query params.

    test('should sanitize request query', async () => {
        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users?uuids=${johnUUID}`, {
            headers: {
                'Content-Type': 'application/json',
                Origin: 'http://test.com'
            }
        });

        expect(response.status).toBe(200);

        const users = response.data;
        expect(users.length).toBe(1);
        expect(users[0].uuid).toBe(johnUUID);
        expect(users[0].name).toBe(xssSanitized);
    });
});
