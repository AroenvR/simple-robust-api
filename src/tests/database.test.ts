import { Database } from '../classes/Database';
import { constants } from '../util/constants';

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
        database = new Database({ filename: ':memory:', type: constants.database.types.SQLITE3 });
    });

    afterEach(async () => {
        if (database) await database.close();
    });

    test('Successfully connects', async () => {
        await database.connect();
    });

    test('Successfully sets up', async () => {
        await database.connect();
        await database.setup();
    });
});
