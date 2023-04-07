import { Container } from "../../classes/Container";
import { Database } from "../../classes/Database";
import { UserRepo } from "../../repo/UserRepo";

describe('UserRepo', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;

    beforeAll(() => {
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });

        // Create a new container instance with a mock database.
        container = new Container();

        container.service('Database', () => new Database({ filename: ':memory:' }));
        container.service('UserRepo', (c) => new UserRepo(c.Database));

        database = container.Database;
        userRepo = container.UserRepo;
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(async () => {
        await database.connect();
        await database.setup();
    });

    afterEach(async () => {
        await database.close();
    });

    test('should upsert and user', async () => { // TODO: Create User class, service layer and controller.
        await userRepo.upsert(["John Doe"]);

        const users = await userRepo.getAll();
        expect(users.length).toBe(1);
    });

    // test('should get all users', async () => {
    //     const users = await userRepo.getAll();
    //     expect(users.length).toBe(1);
    //     expect(users[0].name).toBe('John Doe');
    // });

    // test('should not insert user with same name', async () => {
    //     await userRepo.upsert();
    //     const users = await userRepo.getAll();
    //     expect(users.length).toBe(2);
    //     await userRepo.upsert();
    //     const newUsers = await userRepo.getAll();
    //     expect(newUsers.length).toBe(2);
    // });
});
