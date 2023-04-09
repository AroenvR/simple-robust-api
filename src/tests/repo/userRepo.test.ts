import { Container } from "../../classes/Container";
import { Database } from "../../classes/Database";
import { UserRepo } from "../../api/repo/UserRepo";
import { User } from "../../api/model/User";
import { UserDTO } from "../../api/dto/UserDTO";
import { constants } from "../../util/constants";
import { generateUUID } from "../../util/uuid";

describe('UserRepo', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;

    const johnUUID = generateUUID();

    beforeAll(async () => {
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });

        // Create a new container instance with a mock database.
        container = new Container();

        container.service('Database', () => new Database({ filename: ':memory:', type: constants.database.types.SQLITE3 }));
        container.service('UserRepo', (c) => new UserRepo(c.Database));

        database = container.Database;
        userRepo = container.UserRepo;

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
