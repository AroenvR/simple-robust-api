import { request } from "https";
import App from "../classes/App";
import { Container } from "../classes/Container";
import { Database } from "../classes/Database";
import { constants } from "../util/constants";
import { httpGet, httpsGet } from "../util/http";
import { testServerConfig } from "./testServerConfig";
import { TaskProcessor } from "../util/TaskProcessor";
import { PubSub } from "../util/PubSub";
import { UserRepo } from "../api/repo/UserRepo";
import { UserService } from "../api/service/UserService";
import { UserController } from "../api/controller/UserController";
import { RouteInitEvent } from "../util/RouteInitEvent";

/**
 * Test suite for the App class.
 */
describe('App', () => {
    let app: App;

    beforeAll(async () => {
        // Disable console.log methods before all tests
        // jest.spyOn(console, 'debug').mockImplementation(() => { });
        // jest.spyOn(console, 'info').mockImplementation(() => { });
        // jest.spyOn(console, 'log').mockImplementation(() => { });

        const iocContainer = new Container(testServerConfig);

        // Util
        iocContainer.register(RouteInitEvent, () => new RouteInitEvent());
        iocContainer.register(PubSub, (c) => new PubSub());
        iocContainer.register(TaskProcessor, (c) => new TaskProcessor({ ...c.getConfiguration().tasks }));

        // Database
        iocContainer.register(Database, (c) => new Database({ ...c.getConfiguration().database }));

        // Repo's
        iocContainer.register(UserRepo, (c) => new UserRepo(c.get(Database)));

        // Services
        iocContainer.register(UserService, (c) => new UserService(c.get(UserRepo), c.get(TaskProcessor), c.get(PubSub)));

        // Controllers
        iocContainer.register(UserController, (c) => new UserController(c.get(UserService), c.get(RouteInitEvent)));

        // App
        iocContainer.register(App, (c) => new App({ ...c.getConfiguration().app, database: c.get(Database), routeInitEvent: c.get(RouteInitEvent) }));

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

    test('handles an HTTP get request', async () => {
        const response = await httpGet(`localhost:${testServerConfig.app.port}/users`);

        expect(response).toBeTruthy();
    });
});