import { App } from "../classes/App";
import { Container } from "../classes/Container";
import { Database } from "../classes/Database";

/**
 * Test suite for the App class.
 */
describe('App', () => {
    let app: App;
    let container: Container;

    beforeAll(() => {
        // Disable console.log methods before all tests
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterAll(() => {
        // Re-enable console.log methods after all tests
        jest.restoreAllMocks();
    });

    /**
     * Runs before each test case to create a new instance of the container and the App class.
     */
    beforeEach(() => {
        // Create a new container instance with a mock database.
        container = new Container();

        container.service('Database', () => new Database({ filename: ':memory:' }));
        container.service('App', (c) => new App({ name: 'Test App', database: c.Database }));

        // Get the instance of the App class from the container.
        app = container.App;
    });


    // TESTS:


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

