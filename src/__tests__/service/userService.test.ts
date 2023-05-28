import { UserDTO } from "../../api/dto/UserDTO";
import { UserService } from "../../api/service/UserService";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import App from "../../app/App";
import { TYPES } from "../../ioc/TYPES";
import { ContainerWrapper } from "../../ioc/ContainerWrapper";

describe('UserService', () => {
    let app: App;
    let userService: UserService;

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        await app.start();

        userService = containerWrapper.getContainer().get<UserService>(TYPES.Service);
    });

    afterAll(async () => {
        await app.stop();
    });

    // ----------------------------

    test('should create a user', async () => {
        const userDto = new UserDTO();
        userDto._uuid = generateUUID();
        userDto._name = 'John Doe';

        const result = await userService.upsert([userDto]);
        expect(result).toEqual([{ id: 1, uuid: userDto._uuid, name: userDto._name }]);
    });

    test('should create multiple users', async () => {
        const userDto1 = new UserDTO();
        userDto1._uuid = generateUUID();
        userDto1._name = 'Jane Doe';

        const userDto2 = new UserDTO();
        userDto2._uuid = generateUUID();
        userDto2._name = 'Joe Bloggs';

        const result = await userService.upsert([userDto1, userDto2]);
        expect(result).toEqual([
            {
                id: 2,
                uuid: userDto1._uuid,
                name: userDto1._name
            },
            {
                id: 3,
                uuid: userDto2._uuid,
                name: userDto2._name
            },
        ]);
    });

    test('should get all users', async () => {
        const users = await userService.getAll();
        expect(users.length).toBe(3);
        expect(users[0]._name).toBe('John Doe');
    });
});
