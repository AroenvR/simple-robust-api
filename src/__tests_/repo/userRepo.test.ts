import Container from "../../domain/Container";
import Database from "../../domain/Database";
import { UserRepo } from "../../api/repo/UserRepo";
import { User } from "../../api/model/User";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";

describe('UserRepo', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;

    const johnUUID = generateUUID();

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
        const jane = new User(0, generateUUID(), "Jane Doe");

        const lastId = await userRepo.upsert([john, jane]);

        expect(lastId).toBe(2);
    });

    test('should get all users', async () => {
        const users = await userRepo.selectAll();

        expect(users.length).toBe(2);
        expect(users[0].name).toBe('John Doe');
        expect(users[1].name).toBe('Jane Doe');
    });

    test('should not insert user with same UUID', async () => {
        const john = new User(0, johnUUID, "John Doe");

        const users = await userRepo.selectAll();
        expect(users.length).toBe(2);

        await userRepo.upsert([john]);

        const newUsers = await userRepo.selectAll();
        expect(newUsers.length).toBe(2);
    });
});
