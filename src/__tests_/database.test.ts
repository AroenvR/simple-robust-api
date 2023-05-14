import Database from '../database/Database';
import Logger from '../util/Logger';
import { testServerConfig } from './testServerConfig';

describe('Database', () => {
    let database: Database;

    beforeEach(async () => {
        database = new Database({ ...testServerConfig.database });
        Logger.create(testServerConfig.logger);
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
