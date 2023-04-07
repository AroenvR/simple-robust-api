import { Database } from '../classes/Database';
import queries from "../sql/queries"

describe('Database', () => {
    let database: Database;

    beforeAll(() => {
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(async () => {
        database = new Database({ filename: ':memory:' });
        await database.connect();
        await database.setup();
    });

    afterEach(async () => {
        await database.close();
    });

    // TESTS:

    test('select users', async () => {
        const rows = await database.selectAll(queries.users.select_all);
        expect(rows).toBeDefined();
    });
});
