import Container from "../../domain/Container";
import Database from "../../domain/Database";
import { UserDTO } from "../../api/dto/UserDTO";
import { UserRepo } from "../../api/repo/UserRepo";
import { UserService } from "../../api/service/UserService";
import { PubSub } from "../../util/PubSub";
import { TaskProcessor } from "../../util/TaskProcessor";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";

describe('UserService', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;
    let userService: UserService;

    beforeAll(async () => {
        // Create a new container instance with a mock database.
        container = new Container({ ...testServerConfig });

        container.register(Database, () => new Database({ ...testServerConfig.database }));
        container.register(UserRepo, (c) => new UserRepo(c.get(Database)));
        container.register(TaskProcessor, () => new TaskProcessor({ ...testServerConfig.tasks }));
        container.register(PubSub, () => new PubSub());

        container.register(UserService, (c) => new UserService(c.get(UserRepo), c.get(TaskProcessor), c.get(PubSub)));

        database = container.get(Database);
        userRepo = container.get(UserRepo);
        userService = container.get(UserService);

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

        const result = await userService.upsert([userDto]);
        expect(result).toBe(1);
    });

    test('should create multiple users', async () => {
        let userDto1 = new UserDTO();
        userDto1.uuid = generateUUID();
        userDto1.name = 'Jane Doe';

        let userDto2 = new UserDTO();
        userDto2.uuid = generateUUID();
        userDto2.name = 'Joe Bloggs';

        const result = await userService.upsert([userDto1, userDto2]);
        expect(result).toBe(3);
    });

    test('should get all users', async () => {
        const users = await userService.getAll();
        expect(users.length).toBe(3);
        expect(users[0].name).toBe('John Doe');
    });
});
