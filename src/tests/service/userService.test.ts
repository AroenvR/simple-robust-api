import { UserDTO } from "../../api/dto/UserDTO";
import { IUserRepo } from "../../api/interfaces/IUserRepo";
import { User } from "../../api/model/User";
import { UserRepo } from "../../api/repo/UserRepo";
import { UserService } from "../../api/service/UserService";
import { Container } from "../../classes/Container";
import { Database } from "../../classes/Database";
import { PubSub } from "../../util/PubSub";
import { TaskProcessor } from "../../util/TaskProcessor";
import { constants } from "../../util/constants";
import { generateUUID } from "../../util/uuid";

describe('UserService', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;
    let userService: UserService;

    beforeAll(async () => {
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });

        // Create a new container instance with a mock database.
        container = new Container();

        container.service('Database', () => new Database({ filename: ':memory:', type: constants.database.types.SQLITE3 }));
        container.service('UserRepo', (c) => new UserRepo(c.Database));
        container.service('TaskProcessor', () => new TaskProcessor());
        container.service('PubSub', () => new PubSub());

        container.service('UserService', (c) => new UserService(c.UserRepo, c.TaskProcessor, c.PubSub));

        database = container.Database;
        userRepo = container.UserRepo;
        userService = container.UserService;

        await database.connect();
        await database.setup();
    });

    afterAll(async () => {
        await database.close();

        jest.restoreAllMocks();
    });

    // ----------------------------

    test('should create a user', async () => {
        let userDto = new UserDTO();
        userDto.uuid = generateUUID();
        userDto.name = 'John Doe';

        const result = await userService.create(userDto);
        expect(result).toBe(1);
    });

    test('should create multiple users', async () => {
        let userDto1 = new UserDTO();
        userDto1.uuid = generateUUID();
        userDto1.name = 'Jane Doe';

        let userDto2 = new UserDTO();
        userDto2.uuid = generateUUID();
        userDto2.name = 'Joe Bloggs';

        const result = await userService.create([userDto1, userDto2]);
        expect(result).toBe(3);
    });

    test('should get all users', async () => {
        const users = await userService.getAll();
        expect(users.length).toBe(3);
        expect(users[0].name).toBe('John Doe');
    });
});
