import { UserDTO } from "../../api/dto/UserDTO";
import { UserService } from "../../api/service/UserService";
import { generateUUID } from "../../util/uuid";
import { testServerConfig } from "../testServerConfig";
import App from "../../domain/App";
import { TYPES } from "../../ioc_container/IocTypes";
import { ContainerWrapper } from "../../ioc_container/ContainerWrapper";

describe('UserService', () => {
    let app: App;
    let userService: UserService;

    const johnUUID = generateUUID();

    beforeAll(async () => {
        const containerWrapper = new ContainerWrapper(testServerConfig);
        containerWrapper.initContainer();

        app = containerWrapper.getContainer().get<App>(TYPES.App);
        userService = containerWrapper.getContainer().get<UserService>(TYPES.Service);
        await app.start();
    });

    afterAll(async () => {
        await app.stop();
    });

    // ----------------------------

    test('should create a user', async () => {
        let userDto = new UserDTO();
        userDto.uuid = johnUUID;
        userDto.name = 'John Doe';

        const result = await userService.upsert([userDto]);
        expect(result).toEqual([{ id: 1, uuid: userDto.uuid, name: userDto.name }]);
    });

    test('should create multiple users', async () => {
        let userDto1 = new UserDTO();
        userDto1.uuid = generateUUID();
        userDto1.name = 'Jane Doe';

        let userDto2 = new UserDTO();
        userDto2.uuid = generateUUID();
        userDto2.name = 'Joe Bloggs';

        const result = await userService.upsert([userDto1, userDto2]);
        expect(result).toEqual([
            {
                id: 2,
                uuid: userDto1.uuid,
                name: 'Jane Doe'
            },
            {
                id: 1,
                uuid: johnUUID,
                name: 'John Doe'
            },
        ]);
    });

    test('should get all users', async () => {
        const users = await userService.getAll();
        expect(users.length).toBe(3);
        expect(users[0].name).toBe('John Doe');
    });
});
