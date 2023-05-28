import axios from 'axios';
import App from '../../app/App';
import { testServerConfig } from '../testServerConfig';
import { generateUUID } from '../../util/uuid';
import { ContainerWrapper } from '../../ioc/ContainerWrapper';
import { TYPES } from '../../ioc/TYPES';

describe('sanitizeMiddleware', () => {
    let app: App;

    const johnUUID = generateUUID();

    const xssName = '<script>alert("Hello John Doe!")</script>';
    const xssSanitized = '&lt;script&gt;alert("Hello John Doe!")&lt;/script&gt;';

    const sqlInjectionName = "' OR 1=1 --";
    const sqlSanitized = "' OR 1=1 --"; // TOOD: Check if this is a problem. I know it's parameterized, but still doesn't seem right.

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

        expect(response.status).toBe(201);

        const users = response.data;
        expect(users[0].uuid).toBe(payload[0].uuid);
        expect(users[0].name).toBe(sqlSanitized);
    });

    // ----------------------------

    test('should sanitize request query', async () => {
        const xssPayload = "<script>alert('xss');</script>";
        const sqlPayload = "'; DROP TABLE users; --";

        const uuids = [xssPayload, sqlPayload];
        const url = new URL(`http://localhost:${testServerConfig.app.port}/users`);
        url.searchParams.set("uuids", uuids.join(","));

        try {
            await axios.get(url.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                    Origin: 'http://test.com'
                }
            });

            fail("Should have thrown a Validation error.");
        } catch (error: any) {
            expect(error.response.status).toBe(403);
            expect(error.response.data.message).toBe('Validation failed.');
        }
    });
});
