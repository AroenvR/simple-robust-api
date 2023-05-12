import Container from "../../domain/Container";
import Database from "../../database/Database";
import { UserRepo } from "../../api/repo/UserRepo";
import { User } from "../../api/model/User";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";

describe('UserRepo', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;

    const johnUUID = generateUUID();
    const janeUUID = generateUUID();

    beforeAll(async () => {
        // Create a new container instance with a mock database.
        container = new Container({ ...testServerConfig });

        container.register(Database, () => new Database({ ...testServerConfig.database }));
        container.register(UserRepo, (c) => new UserRepo(c.get(Database)));

        database = container.get(Database);
        userRepo = container.get(UserRepo);

        await database.connect();
        await database.setup();
    });

    afterAll(async () => {
        await database.close();

        jest.restoreAllMocks();
    });

    // ----------------------------

    test('should upsert a user', async () => {
        const john = new User(0, johnUUID, "John Doe");
        const jane = new User(0, janeUUID, "Jane Doe");

        const resp = await userRepo.upsert([john, jane]);

        expect(resp).toEqual([
            {
                id: 2,
                uuid: janeUUID,
                name: 'Jane Doe'
            },
            {
                id: 1,
                uuid: johnUUID,
                name: 'John Doe'
            }
        ]);
    });

    test('should get all users', async () => {
        const users = await userRepo.getAll();

        expect(users.length).toBe(2);
        expect(users[0].name).toBe('John Doe');
        expect(users[1].name).toBe('Jane Doe');
    });

    test('should not insert user with same UUID', async () => {
        const john = new User(0, johnUUID, "John Doe");

        const users = await userRepo.getAll();
        expect(users.length).toBe(2);

        await userRepo.upsert([john]);

        const newUsers = await userRepo.getAll();
        expect(newUsers.length).toBe(2);
    });
});
