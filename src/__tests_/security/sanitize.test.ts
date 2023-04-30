import axios from 'axios';
import App from '../../domain/App';
import Container from '../../domain/Container';
import { testServerConfig } from '../testServerConfig';

//TODO: Fix
describe.skip('sanitizeMiddleware', () => {
    let app: App;

    beforeAll(async () => {
        const iocContainer = new Container(testServerConfig);
        iocContainer.initContainer();

        app = iocContainer.get(App);
        await app.start();
    });

    afterAll(async () => {
        await app.stop();
        jest.restoreAllMocks();
    });

    test('should sanitize request body and query', async () => {
        const requestBody = {
            key: '<script>alert("XSS")</script>',
        };
        const requestQuery = {
            key: '<script>alert("XSS")</script>',
        };

        const response = await axios.post(`http://localhost:${testServerConfig.app.port}/users`, requestBody, {
            params: requestQuery,
        });

        expect(response.status).toBe(200);
        expect(response.data.body.key).toBe('alert("XSS")');
        expect(response.data.query.key).toBe('alert("XSS")');
    });

    test('should sanitize server response', async () => {
        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/sanitize-test-response`);

        expect(response.status).toBe(200);
        expect(response.data.key).toBe('alert("XSS")');
    });
});
