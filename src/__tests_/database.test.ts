import Database from '../database/Database';
import { testServerConfig } from './testServerConfig';

describe('Database', () => {
    let database: Database;

    beforeEach(async () => {
        database = new Database({ ...testServerConfig.database });
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
