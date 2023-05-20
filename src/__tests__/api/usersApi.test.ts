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

    const origin = 'http://test.com';
    const johnUUID = generateUUID();
    const janeUUID = generateUUID();

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

    test('handles an HTTP POST request from whitelisted origin', async () => {
        const payload = [
            {
                uuid: johnUUID,
                name: 'John Doe'
            },
            {
                uuid: janeUUID,
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
        expect(response.data).toEqual([
            {
                id: 1,
                uuid: johnUUID,
                name: 'John Doe'
            },
            {
                id: 2,
                uuid: janeUUID,
                name: 'Jane Doe'
            },
        ]);
    });

    // ----------------------------

    test('handles an HTTP GET request from whitelisted origin', async () => {
        const response = await axios.get(`http://localhost:${testServerConfig.app.port}/users`, {
            headers: {
                Origin: origin
            }
        });

        expect(response.status).toBe(200);
        expect(response.data).toEqual([
            {
                id: 1,
                uuid: johnUUID,
                name: 'John Doe'
            },
            {
                id: 2,
                uuid: janeUUID,
                name: 'Jane Doe'
            },
        ]);
    });

    // ----------------------------

    test('handles an HTTP GET request with uuids query', async () => {
        const uuids = [johnUUID, janeUUID];
        const url = new URL(`http://localhost:${testServerConfig.app.port}/users`);
        url.searchParams.set("uuids", uuids.join(","));

        const response = await axios.get(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
                Origin: origin
            }
        });

        expect(response.status).toBe(200);

        const users = response.data;
        expect(users.length).toBe(2);
        expect(users[0].uuid).toBe(johnUUID);
        expect(users[0].name).toBe('John Doe');
        expect(users[1].uuid).toBe(janeUUID);
        expect(users[1].name).toBe('Jane Doe');
    });
});