import App from "../../domain/App";
import Container from "../../domain/Container";
import Database from "../../domain/Database";
import { httpGet, httpsGet } from "../../util/http";
import { testServerConfig } from "../testServerConfig";
import { TaskProcessor } from "../../util/TaskProcessor";
import { PubSub } from "../../util/PubSub";
import { UserRepo } from "../../api/repo/UserRepo";
import { UserService } from "../../api/service/UserService";
import { UserController } from "../../api/controller/UserController";
import { RouteInitEvent } from "../../util/RouteInitEvent";

/**
 * Integration test for the Users API.
 */
describe('Users API', () => {
    let app: App;

    beforeAll(async () => {
        // Disable console.log methods before all tests
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });

        const iocContainer = new Container(testServerConfig);
        iocContainer.initContainer();

        app = iocContainer.get(App);
        await app.start();
    });

    afterAll(async () => {
        // Shut down the application after all tests.
        await app.stop();

        // Re-enable console.log methods after all tests
        jest.restoreAllMocks();
    });

    // ----------------------------

    // TODO: Create users!

    // ----------------------------

    test('handles an HTTP get request', async () => {
        const response = await httpGet(`localhost:${testServerConfig.app.port}/users`);

        expect(response).toBeTruthy();
    });

});