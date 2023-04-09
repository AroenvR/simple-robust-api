import { App } from "../classes/App";
import { Container } from "../classes/Container";
import { Database } from "../classes/Database";
import { constants } from "../util/constants";

/**
 * Test suite for the App class.
 */
describe('App', () => {
    let container: Container;
    let app: App;
    let database: Database;

    beforeAll(() => {
        // Disable console.log methods before all tests
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });

        container = new Container();

        container.service('Database', () => new Database({ filename: ':memory:', type: constants.database.types.SQLITE3 }));
        container.service('App', (c) => new App({ name: 'Test App', database: c.Database, port: 1337 }));

        // Get the instance of the App class from the container.
        database = container.Database;
        app = container.App;
    });

    afterAll(async () => {
        // Shut down the application after all tests.
        // await app.stop();
        await database.close();

        // Re-enable console.log methods after all tests
        jest.restoreAllMocks();
    });

    /**
     * Test case to check if the App class can start a mocked application.
     */
    test('should start a mocked application', async () => {
        // Spy on the `start` method of the App class.
        const spy = jest.spyOn(app, 'start');

        // Call the `start` method of the App class.
        await app.start();

        // Assert that the `start` method was called.
        expect(spy).toHaveBeenCalled();
    });
});

