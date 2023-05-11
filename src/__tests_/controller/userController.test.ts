import Container from "../../domain/Container";
import Database from "../../domain/Database";
import { UserController } from "../../api/controller/UserController";
import { UserDTO } from "../../api/dto/UserDTO";
import { UserRepo } from "../../api/repo/UserRepo";
import { UserService } from "../../api/service/UserService";
import { PubSub } from "../../util/PubSub";
import { RouteInitEvent } from "../../util/RouteInitEvent";
import { TaskProcessor } from "../../util/TaskProcessor";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import { User } from "../../api/model/User";

describe('UserController', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;
    let userService: UserService;
    let userController: UserController;

    beforeAll(async () => {
        // Create a new container instance with a mock database.
        container = new Container({ ...testServerConfig });

        container.register(Database, () => new Database({ ...testServerConfig.database }));

        container.register(RouteInitEvent, () => new RouteInitEvent());
        container.register(PubSub, () => new PubSub());
        container.register(TaskProcessor, () => new TaskProcessor({ ...testServerConfig.tasks }));

        container.register(UserRepo, (c) => new UserRepo(c.get(Database)));
        container.register(UserService, (c) => new UserService(c.get(UserRepo), c.get(TaskProcessor), c.get(PubSub)));
        container.register(UserController, (c) => new UserController(c.get(UserService), c.get(RouteInitEvent)));

        database = container.get(Database);
        userRepo = container.get(UserRepo);
        userService = container.get(UserService);
        userController = container.get(UserController);

        await database.connect();
        await database.setup();
    });

    afterAll(async () => {
        await database.close();

        jest.restoreAllMocks();
    });

    // ----------------------------

    test('upsert users', async () => {
        let userDto1 = new UserDTO();
        userDto1.uuid = generateUUID();
        userDto1.name = 'John Doe';

        let userDto2 = new UserDTO();
        userDto2.uuid = generateUUID();
        userDto2.name = 'Jane Doe';

        const userDtos = [userDto1, userDto2];

        const result = await userController.upsert(userDtos);
        expect(result).toEqual([
            {
                id: 2,
                uuid: userDto2.uuid,
                name: 'Jane Doe'
            },
            {
                id: 1,
                uuid: userDto1.uuid,
                name: 'John Doe'
            }
        ]);
    });

    // ----------------------------

    test('get all users', async () => {
        const result = await userController.getAll();
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('John Doe');
    });
});
