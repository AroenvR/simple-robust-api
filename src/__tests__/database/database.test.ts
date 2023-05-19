import DatabaseFactory from '../../database/DatabaseFactory';
import { IDatabase } from '../../database/IDatabase';
import Logger from '../../util/logging/Logger';
import { testServerConfig } from '../testServerConfig';

describe('Database', () => {
    let database: IDatabase;

    beforeEach(async () => {
        Logger.create(testServerConfig.logging);
        
        const databaseFactory = new DatabaseFactory();
        database = databaseFactory.createDatabase(testServerConfig.database);
        await database.connect();
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
