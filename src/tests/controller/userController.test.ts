import { UserController } from "../../api/controller/UserController";
import { UserDTO } from "../../api/dto/UserDTO";
import { User } from "../../api/model/User";
import { UserRepo } from "../../api/repo/UserRepo";
import { UserService } from "../../api/service/UserService";
import { Container } from "../../classes/Container";
import { Database } from "../../classes/Database";
import { PubSub } from "../../util/PubSub";
import { RouteInitEvent } from "../../util/RouteInitEvent";
import { TaskProcessor } from "../../util/TaskProcessor";
import { constants } from "../../util/constants";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";

describe('UserController', () => {
    let container: Container;
    let database: Database;
    let userRepo: UserRepo;
    let userService: UserService;
    let userController: UserController;

    beforeAll(async () => {
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });

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
        expect(result).toEqual(2); // TODO: This should return DTO's.
    });

    // ----------------------------

    test('get all users', async () => {
        const result = await userController.selectAll();
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('John Doe');
    });
});
